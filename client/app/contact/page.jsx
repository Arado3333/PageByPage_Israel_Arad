
"use client"
import "../style/Contact.css"

import { useState } from "react"

const Contact = () => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formState.name.trim()) {
      newErrors.name = "Name is required"
    }
    
    if (!formState.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      newErrors.email = "Please enter a valid email"
    }
    
    if (!formState.subject.trim()) {
      newErrors.subject = "Subject is required"
    }
    
    if (!formState.message.trim()) {
      newErrors.message = "Message is required"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      setIsSubmitting(true)
      
      // Simulate API call
      console.log("Form submitted:", formState)
      
      setTimeout(() => {
        setIsSubmitting(false)
        setIsSubmitted(true)
        
        // Reset form after showing success message
        setTimeout(() => {
          setFormState({
            name: "",
            email: "",
            subject: "",
            message: "",
          })
          setIsSubmitted(false)
        }, 3000)
      }, 1500)
    } else {
      // Add shake animation to form
      const form = document.querySelector(".contact-form")
      form.classList.add("shake")
      setTimeout(() => form.classList.remove("shake"), 500)
    }
  }

  return (
    <div className="contact-container">
      <div className="contact-wrapper">
        <div className="contact-header">
          <h1 className="contact-title">Get in Touch</h1>
          <p className="contact-subtitle">
            We'd love to hear from you. Send us your questions, feedback, or feature requests.
          </p>
        </div>

        <div className="contact-content">
          <div className="contact-form-container">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className={`form-group ${errors.name ? "error" : ""}`}>
                <label htmlFor="name" className="form-label">
                  <svg className="form-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Your name"
                />
                {errors.name && <div className="form-error">{errors.name}</div>}
              </div>

              <div className={`form-group ${errors.email ? "error" : ""}`}>
                <label htmlFor="email" className="form-label">
                  <svg className="form-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="your.email@example.com"
                />
                {errors.email && <div className="form-error">{errors.email}</div>}
              </div>

              <div className={`form-group ${errors.subject ? "error" : ""}`}>
                <label htmlFor="subject" className="form-label">
                  <svg className="form-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="4" y1="9" x2="20" y2="9"></line>
                    <line x1="4" y1="15" x2="20" y2="15"></line>
                    <line x1="10" y1="3" x2="8" y2="21"></line>
                    <line x1="16" y1="3" x2="14" y2="21"></line>
                  </svg>
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formState.subject}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="" disabled>Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="bug">Report a Bug</option>
                  <option value="feature">Feature Request</option>
                  <option value="billing">Billing Question</option>
                  <option value="other">Other</option>
                </select>
                {errors.subject && <div className="form-error">{errors.subject}</div>}
              </div>

              <div className={`form-group ${errors.message ? "error" : ""}`}>
                <label htmlFor="message" className="form-label">
                  <svg className="form-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  className="form-textarea"
                  placeholder="Tell us what's on your mind..."
                  rows="5"
                ></textarea>
                {errors.message && <div className="form-error">{errors.message}</div>}
              </div>

              <button 
                type="submit" 
                className={`form-button ${isSubmitting ? "submitting" : ""} ${isSubmitted ? "submitted" : ""}`}
                disabled={isSubmitting || isSubmitted}
              >
                <span className="button-text">
                  {isSubmitting ? "Sending..." : isSubmitted ? "Message Sent!" : "Send Message"}
                </span>
                <span className="button-icon">
                  {isSubmitting ? (
                    <svg className="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" opacity="0.25"></circle>
                      <path d="M12 2a10 10 0 0 1 10 10" opacity="1"></path>
                    </svg>
                  ) : isSubmitted ? (
                    <svg className="check" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  )}
                </span>
              </button>
            </form>
          </div>

          <div className="contact-sidebar">
            <div className="quick-links">
              <h3 className="quick-links-title">Need Faster Support?</h3>
              
              <a href="#" className="quick-link">
                <span className="quick-link-icon bug">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4M6 12a6 6 0 0 1 6-6M18 12a6 6 0 0 0-6-6"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </span>
                <div className="quick-link-content">
                  <span className="quick-link-title">Report a Bug</span>
                  <span className="quick-link-desc">Found something not working?</span>
                </div>
              </a>
              
              <a href="#" className="quick-link">
                <span className="quick-link-icon feature">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </span>
                <div className="quick-link-content">
                  <span className="quick-link-title">Suggest a Feature</span>
                  <span className="quick-link-desc">Share your ideas with us</span>
                </div>
              </a>
              
              <a href="#" className="quick-link">
                <span className="quick-link-icon faq">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                </span>
                <div className="quick-link-content">
                  <span className="quick-link-title">View FAQ</span>
                  <span className="quick-link-desc">Find answers to common questions</span>
                </div>
              </a>
              
              <a href="#" className="quick-link">
                <span className="quick-link-icon docs">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                </span>
                <div className="quick-link-content">
                  <span className="quick-link-title">Documentation</span>
                  <span className="quick-link-desc">Learn how to use our app</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
