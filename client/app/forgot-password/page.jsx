"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import "../style/ForgotPassword.css"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")

    // Mock password reset request
    if (email) {
      setSubmitted(true)
    } else {
      setError("Please enter your email address")
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Reset Password</h1>
          <p className="auth-subtitle">We'll send you a link to reset your password</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        {submitted ? (
          <div className="success-message">
            <p>If an account exists for {email}, you will receive a password reset link in your email shortly.</p>
            <Link href="/signin" className="back-link">
              <ArrowLeft className="back-icon" />
              Back to Sign In
            </Link>
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="auth-button">
              Send Reset Link
            </button>

            <Link href="/signin" className="back-link">
              <ArrowLeft className="back-icon" />
              Back to Sign In
            </Link>
          </form>
        )}
      </div>
    </div>
  )
}
