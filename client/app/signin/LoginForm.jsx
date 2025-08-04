"use client";

import { useActionState, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { Eye, EyeOff, RefreshCw } from "lucide-react";
import "../style/SignIn.css";
import FormField from "./components/FormField";
import SubmitButton from "./SubmitButton";
import { loginAct } from "../lib/actions.js";

export default function LoginForm() {
    const [userInput, setUserInput] = useState({
        email: "",
        password: "",
    });

    const [state, loginAction] = useActionState(loginAct, userInput);

    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1 className="auth-title">Sign In</h1>
                    <p className="auth-subtitle">Welcome to Page by Page</p>
                </div>

                {state?.errors && <p className="auth-error">{state.errors}</p>}

                <form action={loginAction} className="auth-form">
                    <FormField
                        name={"email"}
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
                                name="password"
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

                    <SubmitButton />
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
