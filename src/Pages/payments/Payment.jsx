
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import axiosInstance from "../../utils/axiosInstance";
import CheckoutForm from "./CheckoutForm";
import "./Payment.css";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const Payment = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [debugInfo, setDebugInfo] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setDebugInfo(
          `Fetching course ${courseId} from: ${axiosInstance.defaults.baseURL}/courses/id/${courseId}`
        );
        console.log("🔍 Fetching course for payment:", courseId);

        // Use the courses endpoint instead of payments endpoint
        const response = await axiosInstance.get(`/courses/id/${courseId}`);
        console.log("✅ Course response:", response.data);

        if (response.data) {
          setCourse(response.data);
          setDebugInfo(
            `Course loaded: ${response.data.title} - Price: $${response.data.price}`
          );

          console.log("💰 Course price details:", {
            rawPrice: response.data.price,
            parsedPrice: parseFloat(response.data.price),
            type: typeof response.data.price,
          });
        } else {
          throw new Error("Failed to load course data");
        }
      } catch (err) {
        console.error("❌ Error fetching course:", err);

        // Try alternative endpoint
        try {
          console.log("🔄 Trying alternative endpoint: /courses/${courseId}");
          const altResponse = await axiosInstance.get(`/courses/${courseId}`);
          if (altResponse.data) {
            setCourse(altResponse.data);
            setDebugInfo(
              `Course loaded from alt endpoint: ${altResponse.data.title}`
            );
          } else {
            throw new Error("Alternative endpoint also failed");
          }
        } catch (altErr) {
          setError("Failed to load course information from all endpoints");
          setDebugInfo(`All endpoints failed: ${altErr.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    } else {
      setError("No course ID provided");
      setLoading(false);
    }
  }, [courseId]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="payment-container">
        <div className="payment-content">
          <div className="loading-section">
            <div className="spinner"></div>
            <h2>Loading Course Information...</h2>
            <p>Course ID: {courseId}</p>
            <p className="debug-info">{debugInfo}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payment-container">
        <div className="payment-content">
          <div className="error-section">
            <div className="error-icon">❌</div>
            <h2>Error Loading Course</h2>
            <p>{error}</p>
            <p className="debug-info">{debugInfo}</p>
            <div className="action-buttons">
              <button onClick={handleBack} className="btn-secondary">
                Go Back
              </button>
              <button
                onClick={() => window.location.reload()}
                className="btn-primary"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="payment-container">
        <div className="payment-content">
          <div className="error-section">
            <h2>Course Not Found</h2>
            <p>The course you're trying to enroll in could not be found.</p>
            <button onClick={handleBack} className="btn-secondary">
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const coursePrice = parseFloat(course.price);
  const isValidPrice = !isNaN(coursePrice) && coursePrice > 0;

  console.log("🎯 Final price check:", {
    courseId,
    courseTitle: course.title,
    rawPrice: course.price,
    parsedPrice: coursePrice,
    isValidPrice,
    baseURL: axiosInstance.defaults.baseURL,
  });

  return (
    <div className="payment-container">
      <div className="payment-content">
        <div className="payment-header">
          <h1>Complete Your Enrollment</h1>
          <button onClick={handleBack} className="back-button">
            ← Back to Course
          </button>
        </div>

        <div className="course-summary">
          <h2>{course.title}</h2>
          <p className="course-description">{course.description}</p>

          <div className="price-section">
            <h3>Total: ${isValidPrice ? coursePrice.toFixed(2) : "0.00"}</h3>
            {!isValidPrice && (
              <div className="price-warning">
                <p>⚠️ Invalid course price. Please contact support.</p>
              </div>
            )}
          </div>
        </div>

        {isValidPrice ? (
          <Elements stripe={stripePromise}>
            <CheckoutForm
              courseId={courseId}
              courseTitle={course.title}
              price={coursePrice}
            />
          </Elements>
        ) : (
          <div className="payment-disabled">
            <p>Cannot proceed with payment - invalid course price.</p>
            <p>Please contact support or try again later.</p>
            <button onClick={handleBack} className="btn-secondary">
              Go Back
            </button>
          </div>
        )}

        {/* Debug information - remove in production */}
        {process.env.NODE_ENV === "development" && (
          <div className="debug-info">
            <h4>Debug Information:</h4>
            <p>
              <strong>Course ID:</strong> {courseId}
            </p>
            <p>
              <strong>Course Title:</strong> {course.title}
            </p>
            <p>
              <strong>API Base URL:</strong> {axiosInstance.defaults.baseURL}
            </p>
            <p>
              <strong>Raw Price:</strong> {course.price}
            </p>
            <p>
              <strong>Parsed Price:</strong> {coursePrice}
            </p>
            <p>
              <strong>Price Valid:</strong> {isValidPrice ? "Yes" : "No"}
            </p>
            <p>
              <strong>Environment:</strong> {process.env.NODE_ENV}
            </p>
            <p>
              <strong>Custom API URL:</strong>{" "}
              {process.env.REACT_APP_API_URL || "Not set"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;