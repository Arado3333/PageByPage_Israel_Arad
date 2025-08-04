export default function GoalSkeleton() {
    return (
        <div className="card-content animate-pulse">
            <div className="goal-circle">
                <svg viewBox="0 0 36 36" className="goal-svg">
                    <path
                        className="goal-circle-bg"
                        d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                        className="goal-circle-fill skeleton-loader"
                        strokeDasharray="0, 100"
                        d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <text x="18" y="20.35" className="goal-text skeleton-text">
                        {/* percentage placeholder */}
                    </text>
                </svg>
            </div>
            <div className="goal-details">
                <div className="goal-numbers">
                    <span className="goal-current skeleton-box">-</span>
                    <span className="goal-separator skeleton-box">/</span>
                    <span className="goal-target skeleton-box">-</span>
                    <span className="goal-unit skeleton-box">{/* unit */}</span>
                </div>
                <p className="goal-message skeleton-line">
                    Goals pending...
                </p>
            </div>
        </div>
    );
}
