"use client";
import {use} from 'react';
import { PenTool, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AiSuggestionsContent({aiPromise}) {

    const suggestions = use(aiPromise);
    console.log(suggestions);
    

    return (
        <div className="card-content">
            <ul className="suggestion-list">
                {suggestions.map((suggestion, idx) => (
                    <li key={idx} className="suggestion-item">
                        <div className="suggestion-icon">
                            <PenTool />
                        </div>
                        <div className="suggestion-details">
                            <h3 className="suggestion-title">
                                {suggestion.improvementTitle}
                            </h3>
                            <p className="suggestion-excerpt">
                                {suggestion.improveTip}
                            </p>
                            <p className="suggestion-time">
                                {suggestion.timestamp ?? new Date().toDateString()}
                            </p>
                        </div>
                        <div className="suggestion-actions">
                            <button
                                className="action-button accept"
                                aria-label="Accept suggestion"
                            >
                                <CheckCircle2 className="action-icon" />
                            </button>
                            <button
                                className="action-button reject"
                                aria-label="Reject suggestion"
                            >
                                <AlertCircle className="action-icon" />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
