export default function HeaderLoader() {
    // Skeleton loader for Draft Manager header
    return (
        <div className="dm-header">
            <div className="dm-header-content">
                <div className="dm-header-text">
                    <div
                        className="skeleton skeleton-title"
                        style={{ width: 180, height: 32, marginBottom: 8 }}
                    />
                    <div
                        className="skeleton skeleton-subtitle"
                        style={{ width: 260, height: 18 }}
                    />
                </div>
                <div
                    className="skeleton skeleton-btn"
                    style={{ width: 120, height: 40 }}
                />
            </div>
            <div className="dm-controls">
                <div className="dm-search-container">
                    <div
                        className="skeleton skeleton-input"
                        style={{ width: 320, height: 36 }}
                    />
                </div>
                <div
                    className="dm-filters"
                    style={{ display: "flex", gap: 12 }}
                >
                    <div
                        className="skeleton skeleton-select"
                        style={{ width: 120, height: 36 }}
                    />
                    <div
                        className="skeleton skeleton-select"
                        style={{ width: 120, height: 36 }}
                    />
                </div>
            </div>
            <div className="dm-results-info">
                <div
                    className="skeleton skeleton-text"
                    style={{ width: 100, height: 16 }}
                />
            </div>
        </div>
    );
}
