"use client";

import { use } from "react";

export default function WritingProgressStats({ statsPromise }) {
    const stats = use(statsPromise);
    
    return (
        <div className="card-content">
            <div className="stats-grid">
                <div className="stat-item">
                    <div className="stat-value">{stats.totalBooks}</div>
                    <div className="stat-label">Books</div>
                </div>
                <div className="stat-item">
                    <div className="stat-value">{stats.totalDrafts}</div>
                    <div className="stat-label">Drafts</div>
                </div>
                <div className="stat-item">
                    <div className="stat-value">
                        {stats.totalWords.toLocaleString()}
                    </div>
                    <div className="stat-label">Total Words</div>
                </div>
                <div className="stat-item">
                    <div className="stat-value">
                        {stats.chaptersCompleted? stats.chaptersCompleted : 0}
                    </div>
                    <div className="stat-label">Chapters</div>
                </div>
            </div>
        </div>
    );
}
