"use client";

import { RefreshCw, Send } from "lucide-react";
import { cloneElement } from "react";
import { useFormStatus } from "react-dom";

export default function StateButton({
    handlerFunction,
    disabled,
    loadingText,
    text,
    state,
    icon,
}) {
    function handleClick(e) {
        e.preventDefault();
        handlerFunction();
    }

    // If an icon is provided, clone it and add the spinning class if state is true
    const iconWithSpinningClass = icon 
        ? cloneElement(icon, { 
            className: `button-icon ${state ? 'spinning' : ''} ${icon.props.className || ''}` 
          }) 
        : null;

    return (
        <button
            className="ai-button primary"
            onClick={handleClick}
            disabled={disabled || state || useFormStatus().pending}
        >
            {state ? (
                <>
                    <RefreshCw className="button-icon spinning" />
                    {loadingText || "Loading..."}
                </>
            ) : (
                <>
                    {iconWithSpinningClass || <Send className="button-icon" />}
                    {text}
                </>
            )}
        </button>
    );
}
