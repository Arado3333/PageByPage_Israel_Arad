export default function DraftsFoundLoader() {
    return (
        <div className="dm-results-info">
            <div
                className="skeleton-loader"
                style={{
                    display: "inline-block",
                    width: 80,
                    height: 20,
                    background:
                        "linear-gradient(90deg, #eee 25%, #ddd 50%, #eee 75%)",
                    borderRadius: 4,
                    animation: "skeleton-loading 1.2s infinite",
                }}
            />
            <style>{`
                @keyframes skeleton-loading {
                    0% { background-position: -80px 0; }
                    100% { background-position: 80px 0; }
                }
            `}</style>
        </div>
    );
}
