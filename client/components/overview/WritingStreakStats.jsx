"use client";
import {use} from "react";

export default function WritingStreakStats({streakPromise}) {

    const steak = use(streakPromise);

    return (
        <div className="card-content">
            <div className="streak-header">
                <div className="streak-count">
                    <span className="streak-number">
                        {steak.currentStreak}
                    </span>
                    <span className="streak-label">days</span>
                </div>
                <div className="streak-badge">Current Streak</div>
            </div>
            <div className="streak-calendar">
                {steak.lastWeek.map((active, index) => (
                    <div
                        key={index}
                        className={`streak-day ${active ? "active" : ""}`}
                    >
                        <div className="streak-dot"></div>
                        <div className="streak-day-label">
                            {new Date(
                                Date.now() - (6 - index) * 86400000
                            ).toLocaleDateString("en-US", {
                                weekday: "short",
                            })}
                        </div>
                    </div>
                ))}
            </div>
            <p className="streak-message">
                Write today to maintain your streak!
            </p>
        </div>
    );
}
