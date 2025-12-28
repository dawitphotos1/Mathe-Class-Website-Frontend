
// // components/Contact.jsx - CORRECTED RESPONSE HANDLING VERSION
// import React, { useState } from "react";
// import "./Contact.css";

// const Contact = () => {
//   const [form, setForm] = useState({ 
//     name: "", 
//     email: "", 
//     message: "" 
//   });
//   const [status, setStatus] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [errors, setErrors] = useState({});

//   const validateForm = () => {
//     const newErrors = {};
    
//     if (!form.name.trim()) {
//       newErrors.name = "Name is required";
//     } else if (form.name.length < 2) {
//       newErrors.name = "Name must be at least 2 characters";
//     }
    
//     if (!form.email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
//       newErrors.email = "Please enter a valid email address";
//     }
    
//     if (!form.message.trim()) {
//       newErrors.message = "Message is required";
//     } else if (form.message.length < 10) {
//       newErrors.message = "Message must be at least 10 characters";
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm(prev => ({ ...prev, [name]: value }));
    
//     // Clear error for this field when user starts typing
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: "" }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       setStatus("❌ Please fix the errors in the form.");
//       return;
//     }
    
//     setStatus("⏳ Sending your message...");
//     setIsLoading(true);
    
//     console.log("📨 Sending contact form data:", form);

//     try {
//       // Method 1: Try with fetch first (bypasses axios interceptors)
//       const response = await fetch('https://mathe-class-website-backend-1.onrender.com/api/v1/email/contact', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//         },
//         body: JSON.stringify(form),
//       });
      
//       console.log("📨 Fetch response status:", response.status);
//       console.log("📨 Fetch response headers:", response.headers);
      
//       // Try to parse the response
//       let responseData;
//       try {
//         responseData = await response.json();
//         console.log("📨 Parsed response data:", responseData);
//       } catch (parseError) {
//         console.error("📨 Failed to parse JSON response:", parseError);
//         // If JSON parsing fails, try to get text
//         const textResponse = await response.text();
//         console.log("📨 Text response:", textResponse);
//         responseData = { success: true, message: "Message sent successfully!" };
//       }
      
//       // Check if response indicates success
//       if (response.ok) {
//         if (responseData.success) {
//           setStatus("✅ Message sent successfully! We'll get back to you soon.");
//           setForm({ name: "", email: "", message: "" });
          
//           // Clear success message after 7 seconds
//           setTimeout(() => {
//             setStatus("");
//           }, 7000);
//         } else {
//           setStatus(`❌ ${responseData.error || "Failed to send message. Please try again."}`);
//         }
//       } else {
//         // HTTP error status
//         setStatus(`❌ Server error (${response.status}): ${responseData.error || "Please try again."}`);
//       }
      
//     } catch (fetchError) {
//       console.error("📨 Fetch error:", fetchError);
      
//       // Method 2: Try direct email endpoint with different approach
//       try {
//         console.log("🔄 Trying alternative approach...");
        
//         // Create a simple form data request instead
//         const formData = new URLSearchParams();
//         formData.append('name', form.name);
//         formData.append('email', form.email);
//         formData.append('message', form.message);
        
//         const altResponse = await fetch('https://mathe-class-website-backend-1.onrender.com/api/v1/email/contact', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/x-www-form-urlencoded',
//           },
//           body: formData,
//         });
        
//         if (altResponse.ok) {
//           setStatus("✅ Message sent successfully using alternative method!");
//           setForm({ name: "", email: "", message: "" });
//         } else {
//           throw new Error(`Alternative method failed: ${altResponse.status}`);
//         }
        
//       } catch (altError) {
//         console.error("📨 Alternative method error:", altError);
        
//         // Method 3: Last resort - show contact email
//         setStatus("❌ Failed to send via web form. Please email us directly at: support@matheclass.com");
        
//         // Auto-copy email to clipboard as a convenience
//         try {
//           await navigator.clipboard.writeText('support@matheclass.com');
//           setTimeout(() => {
//             setStatus(prev => prev + " (Email address copied to clipboard 📋)");
//           }, 1000);
//         } catch (clipboardError) {
//           console.log("Clipboard not available");
//         }
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="contact-page">
//       <div className="contact-wrapper">
//         <h1 className="contact-heading">📩 Get in Touch</h1>
//         <p className="contact-subheading">
//           We'd love to hear from you! Whether you have a question about 
//           features, pricing, or anything else — we're ready to help.
//         </p>
        
//         <form className="contact-form" onSubmit={handleSubmit} noValidate>
//           <div className="form-group">
//             <label htmlFor="name">Your Name</label>
//             <input
//               type="text"
//               id="name"
//               name="name"
//               value={form.name}
//               onChange={handleChange}
//               required
//               placeholder="Enter your name"
//               disabled={isLoading}
//               className={errors.name ? "error" : ""}
//               aria-describedby={errors.name ? "name-error" : undefined}
//             />
//             {errors.name && (
//               <div id="name-error" className="error-message" style={{color: '#e74c3c', fontSize: '0.875rem', marginTop: '0.25rem'}}>
//                 {errors.name}
//               </div>
//             )}
//           </div>
          
//           <div className="form-group">
//             <label htmlFor="email">Your Email</label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={form.email}
//               onChange={handleChange}
//               required
//               placeholder="Enter your email"
//               disabled={isLoading}
//               className={errors.email ? "error" : ""}
//               aria-describedby={errors.email ? "email-error" : undefined}
//             />
//             {errors.email && (
//               <div id="email-error" className="error-message" style={{color: '#e74c3c', fontSize: '0.875rem', marginTop: '0.25rem'}}>
//                 {errors.email}
//               </div>
//             )}
//           </div>
          
//           <div className="form-group">
//             <label htmlFor="message">Your Message</label>
//             <textarea
//               id="message"
//               name="message"
//               rows="5"
//               value={form.message}
//               onChange={handleChange}
//               required
//               placeholder="Type your message here..."
//               disabled={isLoading}
//               className={errors.message ? "error" : ""}
//               aria-describedby={errors.message ? "message-error" : undefined}
//             />
//             {errors.message && (
//               <div id="message-error" className="error-message" style={{color: '#e74c3c', fontSize: '0.875rem', marginTop: '0.25rem'}}>
//                 {errors.message}
//               </div>
//             )}
//           </div>
          
//           <button 
//             type="submit" 
//             className="btn-submit"
//             disabled={isLoading}
//             aria-busy={isLoading}
//           >
//             {isLoading ? (
//               <>
//                 <span className="loading-spinner" style={{marginRight: '8px'}}>⏳</span>
//                 Sending...
//               </>
//             ) : (
//               "✉️ Send Message"
//             )}
//           </button>
          
//           {status && (
//             <div 
//               className={`status ${
//                 status.includes('✅') ? 'status-success' : 
//                 status.includes('❌') ? 'status-error' : 
//                 'status-info'
//               }`}
//               role="alert"
//               aria-live="polite"
//             >
//               {status}
//             </div>
//           )}
          
//           <div style={{marginTop: '1.5rem', fontSize: '0.875rem', color: '#7f8c8d', textAlign: 'center'}}>
//             <p>Or email us directly: <strong>greenw17@yahoo.com</strong></p>
//             <p>We typically respond within 24-48 hours.</p>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Contact;





// components/Contact.jsx - SIMPLE EMAIL CLIENT VERSION
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
    } else if (form.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!form.message.trim()) {
      newErrors.message = "Message is required";
    } else if (form.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters";
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
    
    // Reset submitted state when user starts typing again
    if (isSubmitted) {
      setIsSubmitted(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Create the email content
    const subject = `Mathe-Class Website Inquiry from ${form.name}`;
    
    const body = `Dear Math Class Team,

I would like to get in touch with you regarding the following:

Name: ${form.name}
Email: ${form.email}

Message:
${form.message}

Looking forward to your response.

Best regards,
${form.name}
${form.email}
`;
    
    // Encode the subject and body for URL
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    
    // Open user's default email client
    window.location.href = `mailto:greenw17@yahoo.com?subject=${encodedSubject}&body=${encodedBody}`;
    
    // Show success message and reset form
    setIsSubmitted(true);
    setForm({ name: "", email: "", message: "" });
    
    // Clear success message after 5 seconds
    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };

  const handleQuickEmail = () => {
    // Open email client with just a basic subject
    window.location.href = "mailto:greenw17@yahoo.com?subject=Mathe-Class%20Website%20Inquiry";
  };

  return (
    <div className="contact-page">
      <div className="contact-wrapper">
        <h1 className="contact-heading">📩 Get in Touch</h1>
        <p className="contact-subheading">
          We'd love to hear from you! Fill out the form below and we'll open your 
          email client with a pre-filled message ready to send.
        </p>
        
        {/* Quick Email Option */}
        <div className="quick-email-section">
          <p className="quick-email-text">
            <strong>Quick option:</strong> Just want to send a quick email?
          </p>
          <button 
            onClick={handleQuickEmail}
            className="quick-email-btn"
            aria-label="Open email client with basic subject"
          >
            📧 Open Email Client
          </button>
        </div>
        
        <div className="divider">
          <span>or</span>
        </div>
        
        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="name">Your Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
              className={errors.name ? "error" : ""}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <div id="name-error" className="error-message">
                {errors.name}
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Your Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className={errors.email ? "error" : ""}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <div id="email-error" className="error-message">
                {errors.email}
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="message">Your Message *</label>
            <textarea
              id="message"
              name="message"
              rows="5"
              value={form.message}
              onChange={handleChange}
              required
              placeholder="Type your message here..."
              className={errors.message ? "error" : ""}
              aria-describedby={errors.message ? "message-error" : undefined}
            />
            {errors.message && (
              <div id="message-error" className="error-message">
                {errors.message}
              </div>
            )}
          </div>
          
          <button 
            type="submit" 
            className="btn-submit primary-btn"
            aria-label="Open email client with your message"
          >
            ✉️ Open Email Client
          </button>
          
          {/* Success Message */}
          {isSubmitted && (
            <div className="status status-success" role="alert" aria-live="polite">
              ✅ Your email client is opening with a pre-filled message! 
              Just hit "Send" to send us your message.
            </div>
          )}
          
          {/* Instructions */}
          <div className="instructions">
            <p className="instruction-title">How it works:</p>
            <ol className="instruction-list">
              <li>Fill out the form above</li>
              <li>Click "Open Email Client"</li>
              <li>Your default email app will open with a pre-filled message</li>
              <li>Review the message and click "Send"</li>
            </ol>
          </div>
          
          {/* Direct Contact Information */}
          <div className="direct-contact-info">
            <p><strong>Direct email:</strong> greenw17@yahoo.com</p>
            <p className="response-time">
              <small>We typically respond within 24-48 hours.</small>
            </p>
            <p className="alternative-method">
              <small>
                <strong>Alternative:</strong> You can also copy our email address and 
                send us a message directly from your preferred email service.
              </small>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;