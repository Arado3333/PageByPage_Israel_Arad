"use client";

import { use } from "react";

export default function GoalContent({goalsPromise}) {

    const goals = use(goalsPromise);

    return (
        <div className="card-content">
            <div className="goal-circle">
                <svg viewBox="0 0 36 36" className="goal-svg">
                    <path
                        className="goal-circle-bg"
                        d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                        className="goal-circle-fill transition duration-1000"
                        strokeDasharray={`${goals.percentage}, 100`}
                        d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <text x="18" y="20.35" className="goal-text">
                        {goals.percentage}%
                    </text>
                </svg>
            </div>
            <div className="goal-details">
                <div className="goal-numbers">
                    <span className="goal-current">{goals.current}</span>
                    <span className="goal-separator">/</span>
                    <span className="goal-target">{goals.target}</span>
                    <span className="goal-unit">words</span>
                </div>
                <p className="goal-message">
                    {goals.current < goals.target
                        ? `${
                              goals.target - goals.current
                          } more words to reach your daily goal`
                        : "You've reached your daily goal!"}
                </p>
            </div>
        </div>
    );
}
