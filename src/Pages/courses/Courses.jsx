import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAxios } from "../hooks";
import { API_BASE_URL } from "../../config";

const Course = () => {
  const { slug } = useParams();
  const [isFetching, setIsFetching] = useState(false);

  // Memoize options to prevent re-renders
  const axiosOptions = useMemo(
    () => ({
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    }),
    [] // Empty dependency array
  );

  const { data, loading, error } = useAxios(
    `${API_BASE_URL}/api/v1/courses/slug/${slug}`,
    "get",
    axiosOptions
  );

  if (error && !isFetching) {
    setIsFetching(true);
    toast.error(error);
    setIsFetching(false);
  }

  return (
    <div>
      {loading ? (
        <p>Loading course...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : data?.course ? (
        <div>
          <h2>{data.course.title}</h2>
          <p>{data.course.description}</p>
          <p>Subject: {data.course.subject}</p>
          <p>Price: ${data.course.price}</p>
          {data.isEnrolled ? (
            <p>You are enrolled in this course!</p>
          ) : (
            <p>You are not enrolled in this course.</p>
          )}
        </div>
      ) : (
        <p>Course not found</p>
      )}
    </div>
  );
};

export default Course;