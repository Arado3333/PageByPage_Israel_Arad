"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, RefreshCw } from "lucide-react";
import "../style/SignIn.css";
import { logIn } from "../signin/logIn";
import FormField from "./components/FormField";

export default function SignInPage() {
    const [userInput, setUserInput] = useState({
        email: "",
        password: "",
    });

    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        let res = await logIn(userInput.email, userInput.password);

        setIsLoading(false);
        if (res.token) {
            setSuccess(res.message);
            sessionStorage.setItem("user", JSON.stringify(res.token));
            setTimeout(() => {
                window.location.reload();
            }, 1300);
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1 className="auth-title">Sign In</h1>
                    <p className="auth-subtitle">Welcome to Page by Page</p>
                </div>

                {error !== "" ? (
                    <div className="auth-error">{error}</div>
                ) : (
                    success !== "" && (
                        <div className="auth-success">{success}</div>
                    )
                )}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <FormField
                        id={"email"}
                        fieldName={"Email"}
                        fieldType={"email"}
                        value={userInput.email}
                        onChange={(e) =>
                            setUserInput({
                                email: e.target.value,
                                password: userInput.password,
                            })
                        }
                        required
                    />

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <div className="password-input-container">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                className="form-input"
                                value={userInput.password}
                                onChange={(e) =>
                                    setUserInput({
                                        email: userInput.email,
                                        password: e.target.value,
                                    })
                                }
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex="-1"
                            >
                                {showPassword ? (
                                    <EyeOff className="password-icon" />
                                ) : (
                                    <Eye className="password-icon" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="form-options">
                        <div className="remember-me">
                            <input
                                id="remember"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) =>
                                    setRememberMe(e.target.checked)
                                }
                                className="remember-checkbox"
                            />
                            <label
                                htmlFor="remember"
                                className="remember-label"
                            >
                                Remember me
                            </label>
                        </div>
                        <Link
                            href="/forgot-password"
                            className="forgot-password"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <button type="submit" className="auth-button">
                        {isLoading ? (
                            <>
                                <RefreshCw className="loading-icon spinning" />
                                Loading...
                            </>
                        ) : (
                            <span className="loading-icon">Sign In</span>
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Don't have an account?{" "}
                        <Link href="/register" className="auth-link">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
