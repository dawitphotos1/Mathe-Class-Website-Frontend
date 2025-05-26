import React from "react";
import { useNavigate } from "react-router-dom";
import "./CourseList.css";

const CourseList = () => {
  const navigate = useNavigate();

  const fallbackCourses = [
    {
      id: "algebra-1",
      title: "Algebra 1",
      description: "Introduction to Algebra",
      price: 1200,
    },
    {
      id: "algebra-2",
      title: "Algebra 2",
      description: "Advanced Algebra Concepts",
      price: 1200,
    },
    {
      id: "pre-calculus",
      title: "Pre-Calculus",
      description: "Preparation for Calculus",
      price: 1200,
    },
    {
      id: "calculus",
      title: "Calculus",
      description: "Differential and Integral Calculus",
      price: 1250,
    },
    {
      id: "geometry-trigonometry",
      title: "Geometry & Trigonometry",
      description: "Shapes and Angles",
      price: 1250,
    },
    {
      id: "statistics-probability",
      title: "Statistics & Probability",
      description: "Data Analysis and Probability",
      price: 1250,
    },
  ];

  const courseImages = {
    "Algebra 1": "/math-logos/algebra1.jpeg",
    "Algebra 2": "/math-logos/algebra2.png",
    "Pre-Calculus": "/math-logos/Pre-calculus.jpeg",
    Calculus: "/math-logos/Calculus.jpeg",
    "Geometry & Trigonometry": "/math-logos/geometry.jpeg",
    "Statistics & Probability": "/math-logos/statistic.png",
  };

  const handleCourseClick = (slug) => {
    navigate(`/course/${slug}`);
  };

  const formatPrice = (price) =>
    price == null || isNaN(price) ? "N/A" : Number(price).toFixed(2);

  return (
    <div className="course-list">
      <h2>Available Courses</h2>
      <div className="courses-grid">
        {fallbackCourses.map((course) => (
          <div
            key={course.id}
            className="course-card"
            onClick={() => handleCourseClick(course.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && handleCourseClick(course.id)}
            data-testid={`course-${course.id}`}
          >
            <img
              src={
                courseImages[course.title] || "/math-logos/default-course.jpg"
              }
              alt={course.title}
              className="course-image"
            />
            <div className="course-info">
              <h3>{course.title}</h3>
              <p>{course.description || "No description available."}</p>
              <p className="course-price">
                Price: ${formatPrice(course.price)}
              </p>
              <button className="btn btn-primary">View Course</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseList;
