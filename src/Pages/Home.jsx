// pages/Home.jsx
import React, { useEffect, useRef, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
// Temporary fix for framer-motion animations
const MotionDiv = ({ children, ...props }) => <div {...props}>{children}</div>;

import heroImage from "../assets/images/image 30.jpg";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Home.css";

const Home = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const hasShownToast = useRef(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const subjectList = useMemo(
    () => [
      { id: 1, name: "Algebra 1", image: "/math-logos/algebra1.jpeg" },
      { id: 2, name: "Algebra 2", image: "/math-logos/algebra2.png" },
      { id: 3, name: "Pre-Calculus", image: "/math-logos/Pre-calculus.jpeg" },
      { id: 4, name: "Calculus", image: "/math-logos/Calculus.jpeg" },
      {
        id: 5,
        name: "Geometry & Trigonometry",
        image: "/math-logos/geometry.jpeg",
      },
      {
        id: 6,
        name: "Statistics & Probability",
        image: "/math-logos/statistic.png",
      },
    ],
    []
  );

  useEffect(() => {
    setLoading(true);
    try {
      setSubjects(subjectList);
      if (!hasShownToast.current) {
        toast.success("Subjects loaded successfully", {
          toastId: "subjects-toast",
        });
        hasShownToast.current = true;
      }
    } catch (err) {
      console.error("Error loading subjects:", err);
      toast.error("Failed to load subjects");
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  }, [subjectList]);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleLinkClick = (e) => e.stopPropagation();

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading amazing content...
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* ======================
           HERO SECTION
      ====================== */}
      <section className="hero">
        <video className="hero-bg" autoPlay muted loop>
          <source src="/videos/math-background.mp4" type="video/mp4" />
        </video>

        <div className="container">
          {/* Left Side - Text Content */}
          <div className="hero-content">
            <div className="hero-text">
              {/* Math Decoration Symbols */}
              <span className="math-decoration">∫</span>
              <span className="math-decoration">∑</span>
              <span className="math-decoration">π</span>

              <h1>
                <span className="highlight">Master Mathematics</span> with
                Expert Guidance
              </h1>

              <p>
                Interactive courses designed to help you understand complex math
                concepts through engaging lessons and practical examples. Join
                thousands of successful students who transformed their math
                skills.
              </p>

              <div className="cta-buttons">
                <Link
                  to="/register"
                  className="btn btn-primary btn-glow btn-lg"
                  onClick={handleLinkClick}
                >
                  Get Started
                </Link>
                <Link
                  to="/courses"
                  className="btn btn-outline btn-lg"
                  onClick={handleLinkClick}
                >
                  Browse Courses
                </Link>
              </div>

              {/* Stats Counter */}
              <div className="hero-stats">
                <div className="stat-item">
                  <span className="stat-number">2,500+</span>
                  <span className="stat-label">Students</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">98%</span>
                  <span className="stat-label">Success Rate</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">50+</span>
                  <span className="stat-label">Expert Tutors</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="hero-image">
            <div className="floating-3d-container">
              {/* Floating Math Symbols */}
              <span className="floating-math">π</span>
              <span className="floating-math">∑</span>
              <span className="floating-math">∫</span>
              <span className="floating-math">∞</span>

              {/* Glowing Orbs */}
              <div className="glow-orb"></div>
              <div className="glow-orb"></div>

              <img src={heroImage} alt="Students learning math" />
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="scroll-indicator">
          <span>Scroll to explore</span>
          <i className="fas fa-chevron-down"></i>
        </div>
      </section>

      {/* ======================
           FEATURED SUBJECTS
      ====================== */}
      <section className="featured-subjects">
        <h2 className="center-top-heading">📘 Explore Our Core Subjects</h2>
        <div className="container">
          <div className="subjects-grid">
            {subjects.length === 0 ? (
              <p>No subjects available at the moment.</p>
            ) : (
              subjects.map((subject) => (
                <MotionDiv className="subject-card" key={subject.id}>
                  <img
                    src={subject.image}
                    alt={subject.name}
                    className="subject-image"
                    onError={(e) => {
                      e.target.src = "/default-instructor.jpg";
                    }}
                  />
                  <h3 className="subject-title">{subject.name}</h3>
                </MotionDiv>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ======================
           SUCCESS STORIES
      ====================== */}
      <section className="testimonials">
        <div className="testimonials-header">
          <h2 className="section-title">📊 Success Stories</h2>
          <p className="testimonials-subtitle">
            See how students transformed their math skills with our courses
          </p>
        </div>

        <div className="testimonial-carousel">
          {/* Testimonial 1 */}
          <div className="testimonial-card">
            <div className="testimonial-header">
              <img
                src="/testimonials/sarah.jpg"
                alt="Sarah L."
                className="testimonial-avatar"
                onError={(e) => {
                  e.target.src = "/default-avatar.jpg";
                }}
              />
              <div className="testimonial-info">
                <h3 className="testimonial-name">Sarah L.</h3>
                <p className="testimonial-role">High School Senior</p>
                <div className="testimonial-meta">
                  <span>
                    <i className="fas fa-graduation-cap meta-icon"></i> Calculus
                    Student
                  </span>
                  <span className="testimonial-rating">
                    <span className="star">★</span>
                    <span className="star">★</span>
                    <span className="star">★</span>
                    <span className="star">★</span>
                    <span className="star">★</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="testimonial-content">
              <p>
                "I was struggling with calculus concepts for months until I
                found Math Class. The interactive lessons and step-by-step
                explanations made everything click. I went from a C to an A+ in
                just 2 months!"
              </p>

              <div className="testimonial-achievements">
                <div className="achievement-title">
                  <i className="fas fa-trophy"></i> Key Achievements
                </div>
                <ul className="achievement-list">
                  <li>A+ in AP Calculus BC Exam</li>
                  <li>Perfect score on integration problems</li>
                  <li>Accepted to MIT Engineering program</li>
                </ul>
              </div>

              <div className="testimonial-stats">
                <div className="stat">
                  <span className="stat-value">98%</span>
                  <span className="stat-label">Final Grade</span>
                </div>
                <div className="stat">
                  <span className="stat-value">3 mo.</span>
                  <span className="stat-label">Progress Time</span>
                </div>
                <div className="stat">
                  <span className="stat-value">100+</span>
                  <span className="stat-label">Problems Solved</span>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="testimonial-card">
            <div className="testimonial-header">
              <img
                src="/testimonials/daniel.jpg"
                alt="Daniel W."
                className="testimonial-avatar"
                onError={(e) => {
                  e.target.src = "/default-avatar.jpg";
                }}
              />
              <div className="testimonial-info">
                <h3 className="testimonial-name">Daniel W.</h3>
                <p className="testimonial-role">College Freshman</p>
                <div className="testimonial-meta">
                  <span>
                    <i className="fas fa-university meta-icon"></i> Engineering
                    Major
                  </span>
                  <span className="testimonial-rating">
                    <span className="star">★</span>
                    <span className="star">★</span>
                    <span className="star">★</span>
                    <span className="star">★</span>
                    <span className="star">★</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="testimonial-content">
              <p>
                "The algebra courses saved my college GPA! As an engineering
                student, I need strong math foundations. The practice problems
                and video explanations helped me master concepts that were
                holding me back."
              </p>

              <div className="testimonial-achievements">
                <div className="achievement-title">
                  <i className="fas fa-medal"></i> Key Achievements
                </div>
                <ul className="achievement-list">
                  <li>4.0 GPA in College Algebra</li>
                  <li>Top 5% in Linear Algebra class</li>
                  <li>Internship at Google Engineering</li>
                </ul>
              </div>

              <div className="testimonial-stats">
                <div className="stat">
                  <span className="stat-value">4.0</span>
                  <span className="stat-label">GPA</span>
                </div>
                <div className="stat">
                  <span className="stat-value">6 mo.</span>
                  <span className="stat-label">Study Period</span>
                </div>
                <div className="stat">
                  <span className="stat-value">250+</span>
                  <span className="stat-label">Hours Completed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="testimonial-card">
            <div className="testimonial-header">
              <img
                src="/testimonials/maria.jpg"
                alt="Maria K."
                className="testimonial-avatar"
                onError={(e) => {
                  e.target.src = "/default-avatar.jpg";
                }}
              />
              <div className="testimonial-info">
                <h3 className="testimonial-name">Maria K.</h3>
                <p className="testimonial-role">Working Professional</p>
                <div className="testimonial-meta">
                  <span>
                    <i className="fas fa-briefcase meta-icon"></i> Data Analyst
                  </span>
                  <span className="testimonial-rating">
                    <span className="star">★</span>
                    <span className="star">★</span>
                    <span className="star">★</span>
                    <span className="star">★</span>
                    <span className="star">★</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="testimonial-content">
              <p>
                "Returning to math after 10 years was daunting, but the
                Statistics & Probability course made it approachable. I now use
                these skills daily in my data analysis job. The real-world
                examples were invaluable!"
              </p>

              <div className="testimonial-achievements">
                <div className="achievement-title">
                  <i className="fas fa-chart-line"></i> Key Achievements
                </div>
                <ul className="achievement-list">
                  <li>Promoted to Senior Data Analyst</li>
                  <li>30% increase in data processing efficiency</li>
                  <li>Lead statistical modeling projects</li>
                </ul>
              </div>

              <div className="testimonial-stats">
                <div className="stat">
                  <span className="stat-value">92%</span>
                  <span className="stat-label">Course Score</span>
                </div>
                <div className="stat">
                  <span className="stat-value">4 mo.</span>
                  <span className="stat-label">Learning Time</span>
                </div>
                <div className="stat">
                  <span className="stat-value">15+</span>
                  <span className="stat-label">Real Projects</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial Navigation */}
        <div className="testimonial-nav">
          <button className="nav-btn">
            <i className="fas fa-chevron-left"></i>
          </button>
          <div className="nav-dots">
            <span className="nav-dot active"></span>
            <span className="nav-dot"></span>
            <span className="nav-dot"></span>
          </div>
          <button className="nav-btn">
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>

        {/* Success Metrics */}
        <div className="success-metrics">
          <h3 className="metrics-title">Our Students' Success Metrics</h3>
          <div className="metrics-grid">
            <div className="metric-item">
              <div className="metric-icon">📈</div>
              <span className="metric-value">94%</span>
              <span className="metric-label">Grade Improvement</span>
            </div>
            <div className="metric-item">
              <div className="metric-icon">🎓</div>
              <span className="metric-value">2,500+</span>
              <span className="metric-label">Students Helped</span>
            </div>
            <div className="metric-item">
              <div className="metric-icon">⭐</div>
              <span className="metric-value">4.9/5</span>
              <span className="metric-label">Average Rating</span>
            </div>
            <div className="metric-item">
              <div className="metric-icon">⚡</div>
              <span className="metric-value">65%</span>
              <span className="metric-label">Faster Learning</span>
            </div>
          </div>
        </div>
      </section>

      {/* ======================
           FOOTER
      ====================== */}
      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-section about">
            <h3>About Us</h3>
            <p>
              We help students master mathematics with engaging lessons,
              expert-designed courses, and interactive content that builds
              confidence and deep understanding.
            </p>
          </div>

          <div className="footer-section quick-links">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <Link to="/courses" onClick={handleLinkClick}>
                  Courses
                </Link>
              </li>
              <li>
                <Link to="/register" onClick={handleLinkClick}>
                  Register
                </Link>
              </li>
              <li>
                <Link to="/login" onClick={handleLinkClick}>
                  Login
                </Link>
              </li>
              <li>
                <Link to="/contact" onClick={handleLinkClick}>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div className="footer-section contact">
            <h3>Contact</h3>
            <p>Email: greenw17@yahoo.com</p>
            <p>Phone: +1 (123) 456-7890</p>
            <div className="social-icons">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-x-twitter"></i>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Math Class. All rights reserved.</p>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button className="scroll-top" onClick={scrollToTop}>
          <i className="fas fa-arrow-up"></i>
        </button>
      )}
    </div>
  );
};

export default Home;
