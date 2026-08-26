/**
 * Seed script — hits the live product-service REST API directly.
 * Uses REST (not GraphQL) because createProduct needs a seller token
 * and REST is simpler for a one-shot seed without Apollo client setup.
 *
 * Run: node scripts/seed.mjs
 */

const USER_SERVICE = 'https://user-service-c8im.onrender.com';
const PRODUCT_SERVICE = 'https://product-service-kh6b.onrender.com';

// Seed seller credentials — register first if they don't exist
const SELLER = {
    username: 'voltline_seed',
    email: 'seed@voltline.dev',
    password: 'seedpass123',
};

const PRODUCTS = [
    {
        name: 'Braided USB-C to USB-C Cable 1m',
        description: '100W PD charging, 10Gbps data transfer. Nylon braided jacket, aluminum connectors.',
        price: 14.99,
    },
    {
        name: 'Braided USB-C to USB-C Cable 2m',
        description: 'Same 100W spec, extra length for desk setups. Compatible with Thunderbolt 3 ports.',
        price: 18.99,
    },
    {
        name: 'USB-C to MagSafe 3 Cable 2m',
        description: 'Charge MacBook Air and Pro from any USB-C PD adapter. Braided, 140W support.',
        price: 24.99,
    },
    {
        name: 'GaN 65W USB-C Wall Charger',
        description: 'Single port GaN compact charger. Charges MacBook Air at full speed. EU + US plug included.',
        price: 34.99,
    },
    {
        name: 'GaN 100W Dual USB-C Charger',
        description: 'Two USB-C ports, 100W total. Charge laptop + phone simultaneously. Foldable prongs.',
        price: 49.99,
    },
    {
        name: 'Portable 10000mAh USB-C Power Bank',
        description: '22.5W fast charge output, USB-C in/out. Aluminum shell, fits in a jacket pocket.',
        price: 44.99,
    },
    {
        name: 'Laptop Stand — Aluminum Folding',
        description: 'Six adjustable angles, fits 11-17 inch laptops. Hollow design for passive cooling.',
        price: 39.99,
    },
    {
        name: 'Magnetic Cable Organizer (3-pack)',
        description: 'Desk-mounted magnetic clips for USB-C and Lightning cables. Matte black aluminum.',
        price: 12.99,
    },
    {
        name: 'USB-C Hub 7-in-1',
        description: '4K HDMI, 2× USB-A, USB-C PD 100W, SD, microSD, 3.5mm. Plug and play, no drivers.',
        price: 54.99,
    },
    {
        name: 'Mechanical Key Switch Tester (9-switch)',
        description: 'Test Cherry MX Red, Brown, Blue, Silver, Black, Clear, Green, White, Silent Red before buying.',
        price: 9.99,
    },
    {
        name: 'Desk Cable Raceway Kit',
        description: 'Adhesive cable channel for routing 3-4 cables behind a desk. 1.5m length, paintable.',
        price: 16.99,
    },
    {
        name: 'USB-C Travel Pouch',
        description: 'Holds charger, 2 cables, power bank, and earbuds. Water-resistant nylon, zipper pull.',
        price: 19.99,
    },
];

async function post(url, body, token) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
    return { status: res.status, data: await res.json() };
}

async function main() {
    console.log('── Voltline seed script ──');

    // Step 1: Register seller (ignore 409 if already exists)
    console.log(`\n1. Registering seller: ${SELLER.email}`);
    const reg = await post(`${USER_SERVICE}/users/register`, { ...SELLER, role: 'seller' });
    if (reg.status === 201) {
        console.log(`   ✓ Registered. userId: ${reg.data.userId}`);
    } else if (reg.status === 409) {
        console.log('   · Already exists, continuing.');
    } else {
        console.error('   ✗ Register failed:', reg.data);
        process.exit(1);
    }

    // Step 2: Login to get token
    console.log(`\n2. Logging in as ${SELLER.email}`);
    const login = await post(`${USER_SERVICE}/users/login`, {
        email: SELLER.email,
        password: SELLER.password,
    });
    if (login.status !== 200) {
        console.error('   ✗ Login failed:', login.data);
        process.exit(1);
    }
    const token = login.data.token;
    console.log(`   ✓ Token obtained. Role: ${login.data.role}`);

    // Step 3: Seed products
    console.log(`\n3. Seeding ${PRODUCTS.length} products to ${PRODUCT_SERVICE}`);
    let success = 0;
    for (const product of PRODUCTS) {
        const res = await post(`${PRODUCT_SERVICE}/products`, product, token);
        if (res.status === 201) {
            console.log(`   ✓ ${product.name} — $${product.price}`);
            success++;
        } else {
            console.warn(`   ✗ Failed (${res.status}): ${product.name}`, res.data);
        }
    }

    console.log(`\n── Done: ${success}/${PRODUCTS.length} products seeded ──`);
}

main().catch((err) => {
    console.error('Fatal:', err.message);
    process.exit(1);
});
