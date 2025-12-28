
// components/Contact.jsx - CLEARS FORM AFTER SENDING
import React, { useState } from "react";
import "./Contact.css";

const Contact = () => {
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    message: "" 
  });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

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
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Create email subject and body
    const subject = `Mathe-Class Inquiry from ${form.name}`;
    const body = `
Name: ${form.name}
Email: ${form.email}

Message:
${form.message}

---
Sent from Mathe-Class Website
    `.trim();
    
    // Encode for URL
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    
    // Open email client with all information
    window.location.href = `mailto:greenw17@yahoo.com?subject=${encodedSubject}&body=${encodedBody}`;
    
    // Show success message
    setIsSubmitted(true);
    
    // CLEAR THE FORM after a short delay
    setTimeout(() => {
      setForm({ name: "", email: "", message: "" });
    }, 300); // Small delay so user sees the click worked
    
    // Clear success message after 5 seconds
    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };

  const handleQuickEmail = () => {
    // Quick email without form
    window.location.href = "mailto:greenw17@yahoo.com?subject=Mathe-Class%20Inquiry";
  };

  const handleResetForm = () => {
    setForm({ name: "", email: "", message: "" });
    setErrors({});
    setIsSubmitted(false);
  };

  return (
    <div className="contact-page">
      <div className="contact-wrapper">
        <h1 className="contact-heading">📩 Contact Us</h1>
        <p className="contact-subheading">
          We'd love to hear from you! Fill out the form below and we'll open your email client with a pre-filled message.
        </p>
        
        {/* Quick Email Button */}
        <div className="quick-email-section">
          <p className="quick-email-text">
            <strong>Quick option:</strong> Just want to send a quick email?
          </p>
          <button 
            onClick={handleQuickEmail}
            className="quick-email-btn"
            type="button"
          >
            📧 Quick Email
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
            />
            {errors.message && (
              <div className="error-message">{errors.message}</div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="action-buttons">
            <button 
              type="submit" 
              className="submit-btn primary-btn"
            >
              ✉️ Open Email Client
            </button>
            
            {(form.name || form.email || form.message) && !isSubmitted && (
              <button 
                type="button"
                onClick={handleResetForm}
                className="clear-btn"
              >
                🗑️ Clear Form
              </button>
            )}
          </div>
          
          {/* Success Message */}
          {isSubmitted && (
            <div className="success-message">
              ✅ <strong>Email client opened!</strong>
              <br />
              <small>
                Your email should open with all information pre-filled.
                <br />
                Form has been cleared. Send another message?
              </small>
            </div>
          )}
          
          {/* Instructions */}
          <div className="instructions">
            <p><strong>How it works:</strong></p>
            <ol>
              <li>Fill out the form above</li>
              <li>Click "Open Email Client"</li>
              <li>Your email app will open with your information</li>
              <li>Review and click "Send" in your email app</li>
              <li>Form automatically clears for next message</li>
            </ol>
          </div>
          
          {/* Direct Contact Info */}
          <div className="contact-info">
            <p><strong>Our email:</strong> greenw17@yahoo.com</p>
            <p><small>We typically respond within 24-48 hours.</small></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;