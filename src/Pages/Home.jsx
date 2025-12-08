// pages/Home.jsx
import React, { useEffect, useRef, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
// Temporary fix for framer-motion animations
const MotionDiv = ({ children, ...props }) => <div {...props}>{children}</div>;

// import heroImage from "../assets/images/math-hero.jpg";
import heroImage from "../assets/images/main3.png";
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
      { id: 5, name: "Geometry & Trigonometry", image: "/math-logos/geometry.jpeg" },
      { id: 6, name: "Statistics & Probability", image: "/math-logos/statistic.png" },
    ],
    []
  );

  useEffect(() => {
    setLoading(true);
    try {
      setSubjects(subjectList);
      if (!hasShownToast.current) {
        toast.success("Subjects loaded successfully", { toastId: "subjects-toast" });
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
        Loading subjects...
      </div>
    );
  }

  return (
    <div className="home-page">
      <section className="hero">
        <video className="hero-bg" autoPlay muted loop>
          <source src="/videos/math-background.mp4" type="video/mp4" />
        </video>
        <div className="container">
          <MotionDiv className="hero-content">
            <div className="hero-text">
              <h1>
                <span className="highlight">Master Mathematics</span> with Expert Guidance
              </h1>
              <p>
                Interactive courses designed to help you understand complex math concepts
                through engaging lessons and practical examples.
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
            </div>
          </MotionDiv>

          <MotionDiv className="hero-image">
            <img src={heroImage} alt="Students learning math" />
          </MotionDiv>
        </div>
      </section>

      <section className="featured-subjects">
        <h2 className="section-title center-top-heading">📘 Explore Our Core Subjects</h2>
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
                    onError={(e) => { e.target.src = "/default-instructor.jpg"; }}
                  />
                  <h3 className="subject-title">{subject.name}</h3>
                </MotionDiv>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="testimonials">
        <h2 className="section-title center-top-heading">📊 Success Stories</h2>
        <div className="testimonial-carousel">
          <MotionDiv className="testimonial">
            <p>"Thanks to Math Class, I finally understood calculus. The lessons are fun and clear!"</p>
            <h4>- Sarah L., High School Senior</h4>
          </MotionDiv>
          <MotionDiv className="testimonial">
            <p>"I passed my college algebra exam with confidence. Highly recommend these courses!"</p>
            <h4>- Daniel W., College Freshman</h4>
          </MotionDiv>
        </div>
      </section>

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
              <li><Link to="/courses" onClick={handleLinkClick}>Courses</Link></li>
              <li><Link to="/register" onClick={handleLinkClick}>Register</Link></li>
              <li><Link to="/login" onClick={handleLinkClick}>Login</Link></li>
              <li><Link to="/contact" onClick={handleLinkClick}>Contact Us</Link></li>
            </ul>
          </div>

          <div className="footer-section contact">
            <h3>Contact</h3>
            <p>Email: greenw17@yahoo.com</p>
            <p>Phone: +1 (123) 456-7890</p>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-x-twitter"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Math Class. All rights reserved.</p>
        </div>
      </footer>

      {showScrollTop && (
        <button className="scroll-top" onClick={scrollToTop}>
          <i className="fas fa-arrow-up"></i>
        </button>
      )}
    </div>
  );
};

export default Home;
