export default function ProductCardSkeleton() {
    return (
        <div
            className="rounded-xl overflow-hidden animate-pulse"
            style={{ border: '1px solid var(--wire)', background: 'white' }}
        >
            <div className="w-full h-44" style={{ background: 'var(--wire)' }} />
            <div className="px-4 pt-3 pb-4 space-y-2">
                <div className="h-3.5 rounded" style={{ background: 'var(--wire)', width: '70%' }} />
                <div className="h-3 rounded" style={{ background: 'var(--wire)', width: '90%' }} />
                <div className="h-4 rounded mt-2" style={{ background: 'var(--wire)', width: '35%' }} />
            </div>
        </div>
    );
}
