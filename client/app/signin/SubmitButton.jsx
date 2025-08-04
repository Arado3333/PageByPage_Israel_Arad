"use client";
import "../style/SignIn.css";
import { useFormStatus } from "react-dom";
import { RefreshCw } from "lucide-react";

export default function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button disabled={pending} type="submit" className="auth-button">
            <span className="loading-icon text-md font-[600]">Sign In</span>
        </button>
    );
}
