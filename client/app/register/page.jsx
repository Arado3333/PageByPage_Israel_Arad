"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation";
import { Eye, EyeOff, RefreshCw } from "lucide-react"
import "../style/Register.css"

export default function RegisterPage() { //TODO: Create server action for registeration and redirection to the dashboard page.
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  //For automatic routing after register success
  const router = useRouter();


  const handleSubmit = async(e) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password length must be at least 6 characters long");
      return
    }

    if (!(password.includes('@') || password.includes('$') || password.includes('&') || password.includes('!')))
    {
      setError("Your password must contain at least one special character: '@', '$', '&', '!'");
      return
    }
    setIsLoading(true);
    
    try {
      let result = await fetch(`${process.env.NEXT_PUBLIC_SERVICE}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password
        })
      });
      const res = await result.json();
      setIsLoading(false);
      setSuccess(res.message);
      setTimeout(() => {
        router.push('/signin');
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      setError("An error occured while trying to register")
    }

  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join Page by Page</p>
        </div>

        {error !== "" ? <div className="auth-error">{error}</div> : success !== "" && <div className="auth-success">{success}</div>}

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

          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              id="name"
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? <EyeOff color="black" className="password-icon" /> : <Eye color="black" className="password-icon" />}
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
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex="-1"
              >
                {showConfirmPassword ? <EyeOff color="black" className="password-icon" /> : <Eye color="black" className="password-icon" />}
              </button>
            </div>
          </div>

          <button type="submit" className="auth-button"> 
          {isLoading ? (
            <>
            <RefreshCw className="register-icon spinning"/> 
            Loading...
            </>
            ) : (
              <span className="register-icon">Register</span>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <Link href="/signin" className="auth-link">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
