

export default function GoalsSkeletonLoader() {
    return (
        <main className="goals-progress-container animate-pulse">
            <header className="page-header">
                <div
                    className="skeleton-title-loader"
                    style={{
                        width: 180,
                        height: 28,
                        borderRadius: 4,
                        background: "var(--muted)",
                        marginBottom: 8,
                    }}
                />
                <div
                    className="skeleton-button-loader desktop-only"
                    style={{
                        width: 100,
                        height: 38,
                        borderRadius: 4,
                        background: "var(--muted)",
                    }}
                />
            </header>
            <div className="content-container">
                <section className="calendar-section">
                    <div className="calendar-header">
                        <div
                            className="skeleton-calendar-header"
                            style={{
                                width: 120,
                                height: 24,
                                borderRadius: 4,
                                background: "var(--muted)",
                                marginBottom: 8,
                            }}
                        />
                        <div
                            className="skeleton-calendar-controls"
                            style={{ display: "flex", gap: 10 }}
                        >
                            <div
                                className="skeleton-select"
                                style={{
                                    width: 100,
                                    height: 38,
                                    borderRadius: 4,
                                    background: "var(--muted)",
                                }}
                            />
                            <div
                                className="skeleton-select"
                                style={{
                                    width: 100,
                                    height: 38,
                                    borderRadius: 4,
                                    background: "var(--muted)",
                                }}
                            />
                            <div
                                className="skeleton-button"
                                style={{
                                    width: 40,
                                    height: 38,
                                    borderRadius: 4,
                                    background: "var(--muted)",
                                }}
                            />
                        </div>
                    </div>
                    <div className="calendar-grid">
                        <div className="weekday-header">Sun</div>
                        <div className="weekday-header">Mon</div>
                        <div className="weekday-header">Tue</div>
                        <div className="weekday-header">Wed</div>
                        <div className="weekday-header">Thu</div>
                        <div className="weekday-header">Fri</div>
                        <div className="weekday-header">Sat</div>
                        {Array(35)
                            .fill(0)
                            .map((_, index) => (
                                <div
                                    key={index}
                                    className="calendar-day skeleton-day"
                                    style={{
                                        minHeight: 80,
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "flex-start",
                                        paddingTop: 5,
                                    }}
                                >
                                    <div
                                        className="skeleton-day-number"
                                        style={{
                                            width: 25,
                                            height: 25,
                                            borderRadius: "50%",
                                            background: "var(--muted)",
                                        }}
                                    />
                                </div>
                            ))}
                    </div>
                </section>
                <aside className="goals-sidebar">
                    <div className="goals-header">
                        <div
                            className="skeleton-goals-title"
                            style={{
                                width: 120,
                                height: 22,
                                borderRadius: 4,
                                background: "var(--muted)",
                                marginBottom: 8,
                            }}
                        />
                        <div
                            className="skeleton-goals-count"
                            style={{
                                width: 80,
                                height: 20,
                                borderRadius: 4,
                                background: "var(--muted)",
                            }}
                        />
                    </div>
                    <div className="goals-list">
                        {Array(5)
                            .fill(0)
                            .map((_, index) => (
                                <div
                                    key={index}
                                    className="skeleton-goal-item"
                                    style={{
                                        display: "flex",
                                        padding: 10,
                                        marginBottom: 8,
                                        background: "var(--card-background)",
                                        borderRadius: 6,
                                        alignItems: "center",
                                        gap: 10,
                                    }}
                                >
                                    <div
                                        className="skeleton-goal-checkbox"
                                        style={{
                                            width: 20,
                                            height: 20,
                                            borderRadius: "50%",
                                            background: "var(--muted)",
                                        }}
                                    />
                                    <div
                                        className="skeleton-goal-content"
                                        style={{
                                            flex: 1,
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 5,
                                        }}
                                    >
                                        <div
                                            className="skeleton-goal-title"
                                            style={{
                                                width: 80,
                                                height: 16,
                                                borderRadius: 4,
                                                background: "var(--muted)",
                                            }}
                                        />
                                        <div
                                            className="skeleton-goal-category"
                                            style={{
                                                width: 60,
                                                height: 12,
                                                borderRadius: 4,
                                                background: "var(--muted)",
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                    </div>
                </aside>
            </div>
        </main>
    );
}
