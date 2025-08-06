"use client";
import SubmitButton from "../signin/SubmitButton";
import { useState } from "react";

export default function RegisterForm() { //Add server action for registeration
    const [formInput, setFormInput] = useState({
        email: "",
        name: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="email" className="form-label">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    className="form-input"
                    value={formInput.email}
                    onChange={(e) => setFormInput((prev) => (
                        {
                            ...prev,
                            email: e.target.value
                        }
                    ))}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="name" className="form-label">
                    Name
                </label>
                <input
                    id="name"
                    type="text"
                    className="form-input"
                    value={formInput.name}
                    onChange={(e) => setFormInput((prev) => (
                        {
                            ...prev,
                            name: e.target.value
                        }
                    ))}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="password" className="form-label">
                    Password
                </label>
                <div className="password-input-container">
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        className="form-input"
                        value={formInput.password}
                        onChange={(e) => setFormInput((prev) => (
                        {
                            ...prev,
                            password: e.target.value
                        }
                    ))}
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

            <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password
                </label>
                <div className="password-input-container">
                    <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        className="form-input"
                        value={formInput.confirmPassword}
                        onChange={(e) => setFormInput((prev) => (
                        {
                            ...prev,
                            confirmPassword: e.target.value
                        }
                    ))}
                        required
                    />
                    <button
                        type="button"
                        className="password-toggle"
                        onClick={() =>
                            setShowPassword(!showPassword)
                        }
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
            <SubmitButton />
        </form>
    );
}

