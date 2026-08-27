'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { gql } from '../lib/gql';

const GET_PRODUCTS = `query { getProducts(limit: 100, offset: 0) { data { id name description price createdBy } } }`;
const CREATE_PRODUCT = `mutation CreateProduct($name: String!, $description: String!, $price: Float!) {
  createProduct(name: $name, description: $description, price: $price) { id name description price createdBy }
}`;
const UPDATE_PRODUCT = `mutation UpdateProduct($id: ID!, $name: String, $description: String, $price: Float) {
  updateProduct(id: $id, name: $name, description: $description, price: $price) { id name description price createdBy }
}`;
const DELETE_PRODUCT = `mutation DeleteProduct($id: ID!) { deleteProduct(id: $id) }`;

const EMPTY_FORM = { name: '', description: '', price: '' };

export default function DashboardPage() {
    const { user } = useAuth();
    const router = useRouter();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState('');
    const [deleteId, setDeleteId] = useState(null);
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        if (user === null) { router.replace('/auth/login?returnTo=/dashboard'); return; }
        if (user.role === 'buyer') router.replace('/');
    }, [user, router]);

    const fetchProducts = async () => {
        try {
            const data = await gql(GET_PRODUCTS);
            setProducts(data.getProducts.data);
        } catch { /* non-fatal */ }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchProducts(); }, []);

    const flash = (msg) => { setFeedback(msg); setTimeout(() => setFeedback(''), 3000); };

    const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setFormError(''); setFormOpen(true); };
    const openEdit = (p) => { setEditing(p); setForm({ name: p.name, description: p.description, price: String(p.price) }); setFormError(''); setFormOpen(true); };
    const closeForm = () => { setFormOpen(false); setEditing(null); setForm(EMPTY_FORM); };

    const validate = () => {
        if (!form.name.trim()) return 'Name is required.';
        if (!form.description.trim()) return 'Description is required.';
        const price = parseFloat(form.price);
        if (isNaN(price) || price <= 0) return 'Price must be a positive number.';
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        const err = validate();
        if (err) { setFormError(err); return; }
        setSubmitting(true);
        const price = parseFloat(form.price);

        try {
            if (editing) {
                const vars = { id: editing.id };
                if (form.name !== editing.name) vars.name = form.name.trim();
                if (form.description !== editing.description) vars.description = form.description.trim();
                if (price !== editing.price) vars.price = price;
                if (Object.keys(vars).length === 1) { setFormError('No changes detected.'); setSubmitting(false); return; }
                await gql(UPDATE_PRODUCT, vars, user.token);
                flash('Product updated.');
            } else {
                await gql(CREATE_PRODUCT, { name: form.name.trim(), description: form.description.trim(), price }, user.token);
                flash('Product created.');
            }
            closeForm();
            await fetchProducts();
        } catch (err) {
            setFormError(err.message || 'Request failed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        setDeleteId(id);
        try {
            await gql(DELETE_PRODUCT, { id }, user.token);
            flash('Product deleted.');
            await fetchProducts();
        } catch (err) {
            flash(err.message || 'Delete failed');
        } finally {
            setDeleteId(null);
        }
    };

    if (!user || user.role === 'buyer') return null;

    return (
        <div className="max-w-4xl mx-auto px-6 py-10">
            <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl font-semibold"
                    style={{ fontFamily: 'var(--font-space), system-ui', color: 'var(--ink)' }}>
                    Product Dashboard
                </h1>
                <button onClick={openCreate} className="text-sm px-4 py-2 rounded-lg text-white"
                    style={{ background: 'var(--signal)' }}>+ New product</button>
            </div>

            <p className="text-xs mb-6" style={{ color: 'var(--slate)' }}>
                Accessible to <strong>seller</strong> and <strong>admin</strong> roles.
                Sellers can only edit or delete their own products. Admins can modify any product.
            </p>

            {feedback && (
                <div className="text-sm px-4 py-2.5 rounded-lg mb-5"
                    style={{ background: '#D1FAE5', color: '#065F46', border: '1px solid #A7F3D0' }}>
                    {feedback}
                </div>
            )}

            {loading ? (
                <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-14 rounded-xl animate-pulse" style={{ background: 'var(--wire)' }} />
                    ))}
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-sm mb-4" style={{ color: 'var(--slate)' }}>No products yet. Create your first listing.</p>
                    <button onClick={openCreate} className="text-sm px-5 py-2 rounded-lg text-white"
                        style={{ background: 'var(--signal)' }}>Create product</button>
                </div>
            ) : (
                <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--wire)' }}>
                    <div className="hidden sm:grid gap-4 px-4 py-2.5 text-xs font-medium"
                        style={{ background: 'var(--wire)', color: 'var(--slate)', gridTemplateColumns: '1fr 80px 110px' }}>
                        <span>PRODUCT</span><span>PRICE</span><span></span>
                    </div>

                    {products.map((p, i) => {
                        const canModify = user.role === 'admin' || p.createdBy === user.userId;
                        return (
                            <div key={p.id} className="px-4 py-3"
                                style={{ background: i % 2 === 0 ? 'white' : 'var(--mist)', borderTop: '1px solid var(--wire)' }}>
                                {/* Desktop row */}
                                <div className="hidden sm:grid gap-4 items-center"
                                    style={{ gridTemplateColumns: '1fr 80px 110px' }}>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium truncate" style={{ color: 'var(--ink)' }}>{p.name}</p>
                                        <p className="text-xs truncate mt-0.5" style={{ color: 'var(--slate)' }}>{p.description}</p>
                                    </div>
                                    <span className="text-sm" style={{ fontFamily: 'var(--font-mono), monospace', color: 'var(--signal)' }}>
                                        {p.price.toFixed(2)}
                                    </span>
                                    <div className="flex gap-2 justify-end">
                                        {canModify ? (
                                            <>
                                                <button onClick={() => openEdit(p)} className="text-xs px-3 py-1.5 rounded-md"
                                                    style={{ background: 'var(--wire)', color: 'var(--ink)' }}>Edit</button>
                                                <button onClick={() => handleDelete(p.id)} disabled={deleteId === p.id}
                                                    className="text-xs px-3 py-1.5 rounded-md text-white"
                                                    style={{ background: '#EF4444', opacity: deleteId === p.id ? 0.5 : 1 }}>
                                                    {deleteId === p.id ? '…' : 'Delete'}
                                                </button>
                                            </>
                                        ) : (
                                            <span className="text-xs" style={{ color: 'var(--slate)' }}>not yours</span>
                                        )}
                                    </div>
                                </div>

                                {/* Mobile stacked */}
                                <div className="sm:hidden">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <div>
                                            <p className="text-sm font-medium" style={{ color: 'var(--ink)' }}>{p.name}</p>
                                            <span className="text-xs" style={{ fontFamily: 'var(--font-mono), monospace', color: 'var(--signal)' }}>
                                                {p.price.toFixed(2)} USD
                                            </span>
                                        </div>
                                    </div>
                                    {canModify && (
                                        <div className="flex gap-2">
                                            <button onClick={() => openEdit(p)} className="flex-1 text-xs py-1.5 rounded-md"
                                                style={{ background: 'var(--wire)', color: 'var(--ink)' }}>Edit</button>
                                            <button onClick={() => handleDelete(p.id)} disabled={deleteId === p.id}
                                                className="flex-1 text-xs py-1.5 rounded-md text-white"
                                                style={{ background: '#EF4444', opacity: deleteId === p.id ? 0.5 : 1 }}>
                                                {deleteId === p.id ? '…' : 'Delete'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal */}
            {formOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
                    style={{ background: 'rgba(26,26,46,0.5)' }}
                    onClick={(e) => { if (e.target === e.currentTarget) closeForm(); }}>
                    <div className="w-full max-w-md rounded-xl p-6" style={{ background: 'white' }}>
                        <h2 className="text-lg font-semibold mb-5"
                            style={{ fontFamily: 'var(--font-space), system-ui', color: 'var(--ink)' }}>
                            {editing ? 'Edit product' : 'New product'}
                        </h2>

                        {formError && (
                            <div className="text-sm px-4 py-2.5 rounded-lg mb-4"
                                style={{ background: '#FEE2E2', color: '#991B1B', border: '1px solid #FECACA' }}>
                                {formError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--slate)' }}>Name</label>
                                <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                                    placeholder="Braided USB-C Cable 1m" required
                                    className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                                    style={{ background: 'var(--mist)', border: '1px solid var(--wire)', color: 'var(--ink)' }}
                                    onFocus={(e) => (e.target.style.borderColor = 'var(--signal)')}
                                    onBlur={(e) => (e.target.style.borderColor = 'var(--wire)')} />
                            </div>
                            <div>
                                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--slate)' }}>Description</label>
                                <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                                    placeholder="100W PD charging…" required rows={3}
                                    className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-none"
                                    style={{ background: 'var(--mist)', border: '1px solid var(--wire)', color: 'var(--ink)' }}
                                    onFocus={(e) => (e.target.style.borderColor = 'var(--signal)')}
                                    onBlur={(e) => (e.target.style.borderColor = 'var(--wire)')} />
                            </div>
                            <div>
                                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--slate)' }}>Price (USD)</label>
                                <input type="number" step="0.01" min="0.01" value={form.price}
                                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                                    placeholder="29.99" required
                                    className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                                    style={{ background: 'var(--mist)', border: '1px solid var(--wire)', color: 'var(--ink)', fontFamily: 'var(--font-mono), monospace' }}
                                    onFocus={(e) => (e.target.style.borderColor = 'var(--signal)')}
                                    onBlur={(e) => (e.target.style.borderColor = 'var(--wire)')} />
                            </div>
                            <div className="flex gap-3 pt-1">
                                <button type="submit" disabled={submitting}
                                    className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white"
                                    style={{ background: 'var(--signal)', opacity: submitting ? 0.6 : 1 }}>
                                    {submitting ? 'Saving…' : editing ? 'Save changes' : 'Create product'}
                                </button>
                                <button type="button" onClick={closeForm} className="px-5 py-2.5 rounded-lg text-sm"
                                    style={{ background: 'var(--wire)', color: 'var(--ink)' }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
