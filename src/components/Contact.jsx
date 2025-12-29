// components/Contact.jsx - FIXED VERSION (uses backend API)
import React, { useState } from "react";
import axios from "axios";
import "./Contact.css";

const Contact = () => {
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    message: "" 
  });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const API_URL = process.env.REACT_APP_API_URL || "https://mathe-class-website-backend-1.onrender.com/api/v1";

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!form.message.trim()) {
      newErrors.message = "Message is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    
    // Clear submitted state if user starts typing again
    if (isSubmitted) {
      setIsSubmitted(false);
    }
    
    // Clear any API errors
    if (apiError) {
      setApiError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setApiError("");
    
    try {
      // ✅ FIXED: Send to YOUR backend API, not mailto:
      const response = await axios.post(`${API_URL}/email/contact`, {
        name: form.name,
        email: form.email,
        message: form.message
      });
      
      if (response.data.success) {
        // Show success message
        setIsSubmitted(true);
        
        // CLEAR THE FORM
        setTimeout(() => {
          setForm({ name: "", email: "", message: "" });
        }, 300);
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          setIsSubmitted(false);
        }, 5000);
      } else {
        setApiError(response.data.error || "Failed to send message");
      }
    } catch (error) {
      console.error("Contact form error:", error);
      setApiError(
        error.response?.data?.error || 
        error.message || 
        "Failed to send message. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Remove the handleQuickEmail function since it uses mailto:
  const handleQuickEmail = async () => {
    const email = prompt("Please enter your email address:");
    if (!email) return;
    
    const message = prompt("Please enter your message:");
    if (!message) return;
    
    setIsLoading(true);
    
    try {
      const response = await axios.post(`${API_URL}/email/contact`, {
        name: "Quick Contact",
        email: email,
        message: message || "Quick inquiry from website"
      });
      
      if (response.data.success) {
        alert("✅ Your message has been sent! We'll contact you soon.");
      } else {
        alert("❌ Failed to send message: " + (response.data.error || "Unknown error"));
      }
    } catch (error) {
      alert("❌ Error: " + (error.message || "Failed to send message"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetForm = () => {
    setForm({ name: "", email: "", message: "" });
    setErrors({});
    setIsSubmitted(false);
    setApiError("");
  };

  return (
    <div className="contact-page">
      <div className="contact-wrapper">
        <h1 className="contact-heading">📩 Contact Us</h1>
        <p className="contact-subheading">
          We'd love to hear from you! Fill out the form below and we'll get back to you as soon as possible.
        </p>
        
        {/* Quick Email Button */}
        <div className="quick-email-section">
          <p className="quick-email-text">
            <strong>Quick option:</strong> Don't want to fill the form?
          </p>
          <button 
            onClick={handleQuickEmail}
            className="quick-email-btn"
            type="button"
            disabled={isLoading}
          >
            {isLoading ? "⏳ Sending..." : "📧 Quick Message"}
          </button>
        </div>
        
        <div className="divider">
          <span>or</span>
        </div>
        
        {/* Contact Form */}
        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="name">Your Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className={errors.name ? "error" : ""}
              disabled={isLoading}
            />
            {errors.name && (
              <div className="error-message">{errors.name}</div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Your Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={errors.email ? "error" : ""}
              disabled={isLoading}
            />
            {errors.email && (
              <div className="error-message">{errors.email}</div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="message">Your Message</label>
            <textarea
              id="message"
              name="message"
              rows="5"
              value={form.message}
              onChange={handleChange}
              placeholder="Type your message here..."
              className={errors.message ? "error" : ""}
              disabled={isLoading}
            />
            {errors.message && (
              <div className="error-message">{errors.message}</div>
            )}
          </div>
          
          {/* API Error Message */}
          {apiError && (
            <div className="api-error-message">
              ❌ {apiError}
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="action-buttons">
            <button 
              type="submit" 
              className="submit-btn primary-btn"
              disabled={isLoading}
            >
              {isLoading ? "⏳ Sending..." : "✉️ Send Message"}
            </button>
            
            {(form.name || form.email || form.message) && !isSubmitted && (
              <button 
                type="button"
                onClick={handleResetForm}
                className="clear-btn"
                disabled={isLoading}
              >
                🗑️ Clear Form
              </button>
            )}
          </div>
          
          {/* Success Message */}
          {isSubmitted && (
            <div className="success-message">
              ✅ <strong>Message sent successfully!</strong>
              <br />
              <small>
                Thank you for contacting us! We'll get back to you soon.
                <br />
                Form has been cleared. Send another message?
              </small>
            </div>
          )}
          
          {/* Instructions - UPDATED */}
          <div className="instructions">
            <p><strong>How it works:</strong></p>
            <ol>
              <li>Fill out the form above</li>
              <li>Click "Send Message"</li>
              <li>We'll receive your message instantly</li>
              <li>You'll get a confirmation email</li>
              <li>We'll respond within 24-48 hours</li>
            </ol>
          </div>
          
          {/* Direct Contact Info */}
          <div className="contact-info">
            <p><strong>Our response email will come from:</strong> g.mathflam08@gmail.com</p>
            <p><small>Please check your spam folder if you don't see our reply.</small></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;