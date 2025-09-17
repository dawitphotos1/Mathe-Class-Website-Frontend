
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance"; // updated import
import Loading from "../../components/Loading";

const EnrollmentSuccess = () => {
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const sessionId = query.get("session_id");
    const courseId = query.get("courseId"); // Ensure backend adds this in success URL

    if (!sessionId || !courseId) {
      setStatus("error");
      setMessage("Missing payment details.");
      return;
    }

    const confirmEnrollment = async () => {
      try {
        const res = await axiosInstance.post("/api/v1/enrollments/confirm", {
          courseId,
        });

        if (res.data.success) {
          setStatus("success");
          setMessage("Enrollment confirmed! Redirecting to My Courses...");
          setTimeout(() => navigate("/my-courses"), 2500);
        } else {
          setStatus("error");
          setMessage(res.data.error || "Failed to confirm enrollment.");
        }
      } catch (err) {
        setStatus("error");
        setMessage(err.response?.data?.error || "Something went wrong.");
      }
    };

    confirmEnrollment();
  }, [location.search, navigate]);

  if (status === "loading") return <Loading />;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      {status === "success" ? (
        <>
          <h1 className="text-2xl font-bold text-green-600 mb-4">
            ✅ Payment Successful!
          </h1>
          <p>{message}</p>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            ❌ Something went wrong
          </h1>
          <p>{message}</p>
        </>
      )}
    </div>
  );
};

export default EnrollmentSuccess;
