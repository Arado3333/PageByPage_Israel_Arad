"use client";
import "../style/SignIn.css";
import { useFormStatus } from "react-dom";
import { RefreshCw } from "lucide-react";

export default function SubmitButton({ text, className }) {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      type="submit"
      className={`${
        className || "auth-button"
      } flex items-center justify-center gap-2`}
    >
      <span className="text-md font-[600]">{text || "Sign In"}</span>
      {pending && <RefreshCw className="loading-icon animate-spin" size={16} />}
    </button>
  );
}
