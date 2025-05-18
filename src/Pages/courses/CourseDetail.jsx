import React from "react";
import { useParams, Link} from "react-router-dom";
import "./CourseDetail.css";


// 🔁 Map slugs to numeric IDs for Stripe pricing
const slugToIdMap = {
  "algebra-1": 7,
  "algebra-2": 8,
  "pre-calculus": 9,
  calculus: 10,
  "geometry-trigonometry": 11,
  "statistics-probability": 12,
};

const courseData = {
  "algebra-1": {
    title: "Algebra 1",
    description:
      "Master the fundamentals of algebra through engaging lessons, visuals, and real-world applications.",
    contents: [
      {
        unit: "Unit 0 - Review of Prerequisite Skills",
        lessons: [
          "0.1 Solving Simple Equations",
          "0.2 Evaluating Equations",
          "0.3 Graph Linear Equations",
        ],
      },
      {
        unit: "Unit 1 - Analyze Graphs and Expressions",
        lessons: [
          "1.1 Create and Analyze Graphs",
          "1.2 Modeling with Graphs",
          "1.3 Algebraic Properties",
          "1.4 Add and Subtract Polynomials",
          "1.5 Multiply Polynomials",
          "Unit 1 Review",
        ],
      },
      {
        unit: "Unit 2 - Create & Solve Equations/Inequalities",
        lessons: [
          "2.1 True/False Equations",
          "2.2 Solve Equations",
          "2.3 Solve Inequalities",
          "2.4 Rational Equations",
          "2.5 Rearranging Formulas",
          "Unit 2 Review",
        ],
      },
      {
        unit: "Unit 3 - Systems of Equations",
        lessons: [
          "3.1 Standard Form Equations of Lines",
          "3.2 Systems of Inequalities",
          "3.3 Graphing Systems of Equations",
          "3.4 Substitution Method",
          "3.5 Elimination Method",
          "Unit 3 Review",
        ],
      },
      {
        unit: "Unit 4 - Descriptive Statistics",
        lessons: [
          "4.1 Describing Data",
          "4.2 Data Distributions",
          "4.3 Boxplots",
          "4.4 Comparing Distributions",
          "Unit 4 Review",
        ],
      },
      {
        unit: "Unit 5 - Bivariate Data",
        lessons: [
          "5.1 Frequency Tables",
          "5.2 Modeling Relationships",
          "5.3 Correlation",
          "Unit 5 Review",
        ],
      },
      {
        unit: "Unit 6 - Linear and Exponential Sequences",
        lessons: [
          "6.1 Sequences",
          "6.2 Recursive Formulas",
          "6.3 Explicit Formulas",
          "Unit 6 Review",
        ],
      },
      {
        unit: "Unit 7 - Exponential Functions",
        lessons: [
          "7.1 Exponential Growth",
          "7.2 Exponential Decay",
          "7.3 Linear vs. Exponential Models",
          "Unit 7 Review",
        ],
      },
      {
        unit: "Unit 8 - Functions",
        lessons: [
          "8.1 Functions, Domain and Range",
          "8.2 Graphs of Functions",
          "8.3 Piecewise Functions",
          "8.4 Graphing Functions to Solve Equations",
          "Unit 8 Review",
        ],
      },
      {
        unit: "Unit 9 - Factoring",
        lessons: [
          "9.1 Greatest Common Factor",
          "9.2 Factor Trinomials",
          "9.3 Factor Trinomials by Grouping",
          "9.4 Multi-Step Factoring",
          "Unit 9 Review",
        ],
      },
      {
        unit: "Unit 9 (Mr. Bean's Lessons) - Factoring",
        lessons: [
          "9.1 Greatest Common Factor",
          "9.2 Factor Trinomials - Guess and Check",
          "9.3 Factor Trinomials by Grouping",
          "9.4 Finding Zeros (Roots)",
          "Unit 9 Review",
        ],
      },
      {
        unit: "Unit 10 - Quadratics",
        lessons: [
          "10.1 Intro To Quadratics",
          "10.2 Quadratics in Vertex Form",
          "10.3 Quadratics in Standard Form",
          "10.4 Modeling with Quadratics",
          "Unit 10 Review",
        ],
      },
      {
        unit: "Unit 11 - Solving Quadratics",
        lessons: [
          "11.1 Simplify Radicals",
          "11.2 Solve Quadratics Using Square Roots",
          "11.3 Quadratic Formula",
          "11.4 Completing the Square",
          "Unit 11 Review",
        ],
      },
    ],
  },

  "algebra-2": {
    title: "Algebra 2",
    description:
      "Explore equations, functions, systems, matrices, radicals, polynomials, logarithms, conics, sequences, and trigonometry.",
    contents: [
      {
        unit: "Chapter 1: Equations and Inequalities",
        lessons: [
          "1.1 Real Numbers and Number Operations",
          "1.2 Algebraic Expressions and Models",
          "1.3 Solving Linear Equations",
          "1.4 Rewriting Equations and Formulas",
          "1.5 Problem Solving Using Algebraic Models",
          "1.6 Solving Linear Inequalities",
          "1.7 Solving Absolute Value Equations and Inequalities",
        ],
      },
      {
        unit: "Chapter 2: Linear Equations and Functions",
        lessons: [
          "2.1 Functions and Their Graphs",
          "2.2 Slope and Rate of Change",
          "2.3 Quick Graphs of Linear Equations",
          "2.4 Writing Equations of Lines",
          "2.5 Correlation and Best-Fitting Lines",
          "2.6 Linear Inequalities in Two Variables",
          "2.7 Piecewise Functions",
          "2.8 Absolute Value Functions",
        ],
      },
      {
        unit: "Chapter 3: Systems of Linear Equations and Inequalities",
        lessons: [
          "3.1 Solving Linear Systems by Graphing",
          "3.2 Solving Linear Systems Algebraically",
          "3.3 Graphing and Solving Systems of Linear Inequalities",
          "3.4 Linear Programming",
          "3.5 Graphing Linear Equations in Three Variables",
          "3.6 Solving Systems of Linear Equations in Three Variables",
        ],
      },
      {
        unit: "Chapter 4: Matrices and Determinants",
        lessons: [
          "4.1 Matrix Operations",
          "4.2 Multiplying Matrices",
          "4.3 Determinants and Cramer's Rule",
          "4.4 Identity and Inverse Matrices",
          "4.5 Solving Systems Using Inverse Matrices",
        ],
      },
      {
        unit: "Chapter 5: Quadratic Functions",
        lessons: [
          "5.1 Graphing Quadratic Functions",
          "5.2 Solving Quadratic Equations by Factoring",
          "5.3 Solving Quadratic Equations by Finding Square Roots",
          "5.4 Complex Numbers",
          "5.5 Completing the Square",
          "5.6 The Quadratic Formula and the Discriminant",
          "5.7 Graphing and Solving Quadratic Inequalities",
          "5.8 Modeling with Quadratic Functions",
        ],
      },
      {
        unit: "Chapter 6: Polynomials and Polynomial Functions",
        lessons: [
          "6.1 Using Properties of Exponents",
          "6.2 Evaluating and Graphing Polynomial Functions",
          "6.3 Adding, Subtracting, and Multiplying Polynomials",
          "6.4 Factoring and Solving Polynomial Equations",
          "6.5 The Remainder and Factor Theorems",
          "6.6 Finding Rational Zeros",
          "6.7 Using the Fundamental Theorem of Algebra",
          "6.8 Analyzing Graphs of Polynomial Functions",
          "6.9 Modeling with Polynomial Functions",
        ],
      },
      {
        unit: "Chapter 7: Powers, Roots, and Radicals",
        lessons: [
          "7.1 nth Roots and Rational Exponents",
          "7.2 Properties of Rational Exponents",
          "7.3 Power Functions and Function Operations",
          "7.4 Inverse Functions",
          "7.5 Graphing Square Root and Cube Root Functions",
          "7.6 Solving Radical Equations",
          "7.7 Statistics and Statistical Graphs",
        ],
      },
      {
        unit: "Chapter 8: Exponential and Logarithmic Functions",
        lessons: [
          "8.1 Exponential Growth",
          "8.2 Exponential Decay",
          "8.3 The Number e",
          "8.4 Logarithmic Functions",
          "8.5 Properties of Logarithms",
          "8.6 Solving Exponential and Logarithmic Equations",
          "8.7 Modeling with Exponential and Power Functions",
          "8.8 Logistic Growth Functions",
        ],
      },
      {
        unit: "Chapter 9: Rational Equations and Functions",
        lessons: [
          "9.1 Inverse and Joint Variation",
          "9.2 Graphing Simple Rational Functions",
          "9.3 Graphing General Rational Functions",
          "9.4 Multiplying and Dividing Rational Expressions",
          "9.5 Addition, Subtraction, and Complex Fractions",
          "9.6 Solving Rational Equations",
        ],
      },
      {
        unit: "Chapter 10: Quadratic Relations and Conic Sections",
        lessons: [
          "10.1 The Distance and Midpoint Formulas",
          "10.2 Parabolas",
          "10.3 Circles",
          "10.4 Ellipses",
          "10.5 Hyperbolas",
          "10.6 Graphing and Classifying Conics",
          "10.7 Solving Quadratic Systems",
        ],
      },
      {
        unit: "Chapter 11: Sequences and Series",
        lessons: [
          "11.1 Introduction to Sequences and Series",
          "11.2 Arithmetic Sequences and Series",
          "11.3 Geometric Sequences and Series",
          "11.4 Infinite Geometric Series",
          "11.5 Recursive Rules for Sequences",
        ],
      },
      {
        unit: "Chapter 12: Probability and Statistics",
        lessons: [
          "12.1 The Fundamental Counting Principle and Permutations",
          "12.2 Combinations and the Binomial Theorem",
          "12.3 Introduction to Probability",
          "12.4 Probability of Compound Events",
          "12.5 Probability of Independent and Dependent Events",
          "12.6 Binomial Distributions",
          "12.7 Normal Distributions",
        ],
      },
      {
        unit: "Chapter 13: Trigonometric Ratios and Functions",
        lessons: [
          "13.1 Right Triangle Trigonometry",
          "13.2 General Angles and Radian Measure",
          "13.3 Trigonometric Functions of Any Angle",
          "13.4 Inverse Trigonometric Functions",
          "13.5 Law of Sines",
          "13.6 Law of Cosines",
          "13.7 Parametric Equations and Projectile Motion",
        ],
      },
      {
        unit: "Chapter 14: Trigonometric Graphs, Identities, and Equations",
        lessons: [
          "14.1 Graphing Sine, Cosine, and Tangent Functions",
          "14.2 Translations and Reflections of Trigonometric Graphs",
          "14.3 Verifying Trigonometric Identities",
          "14.4 Solving Trigonometric Equations",
          "14.5 Modeling with Trigonometric Functions",
          "14.6 Using Sum and Difference Formulas",
          "14.7 Using Double- and Half-Angle Formulas",
        ],
      },
    ],
  },
  "pre-calculus": {
    title: "Pre-Calculus",
    description:
      "This two-semester course prepares students for calculus through a deep study of algebra, trigonometry, and analytical geometry.",
    contents: [
      {
        unit: "Unit 1: Algebraic Functions",
        lessons: [
          "Linear Equations and Their Graphs",
          "Functions Operations",
          "Inverse Functions",
          "Graphing Quadratic Functions",
          "Polynomial Division and Complex Roots",
          "Graphs of Polynomial Functions",
          "Graphing Rational Expressions",
          "Solving Radical Equations",
          "Sketching Graphs Using Function Transformations",
        ],
      },
      {
        unit: "Unit 2: Exponential and Logarithmic Functions",
        lessons: [
          "Exponential Functions and Their Graphs",
          "Logarithmic Functions and Their Graphs",
          "Properties of Logarithms",
          "Change of Base",
          "Rewriting Logarithmic Expressions",
          "Solving Exponential Equations",
          "Solving Logarithmic Equations",
          "Exponential Growth and Decay Models",
          "Logarithmic Models",
        ],
      },
      {
        unit: "Unit 3: Systems of Equations",
        lessons: [
          "The Substitution Method",
          "Nonlinear Systems of Equations",
          "Solving Systems of Equations Graphically",
          "The Elimination Method",
          "Modeling and Optimization with Two-Variable Linear Systems",
          "Modeling with Non-Linear Systems",
          "Absolute Value Graphs, Equations, and Inequalities",
        ],
      },
      {
        unit: "Unit 4: Topics of Analytic Geometry",
        lessons: [
          "Introduction to Conics: Parabolas",
          "Finding the Standard Equation of a Parabola",
          "Applications of Parabolas",
          "Finding the Standard Equation of an Ellipse",
          "Graphing an Ellipse",
          "Applications of Ellipses",
          "Finding the Standard Equation of a Hyperbola",
          "Using Asymptotes to Sketch a Hyperbola",
          "Using Asymptotes to Find the Standard Equation",
        ],
      },
      {
        unit: "Unit 5: Trigonometry",
        lessons: [
          "Trigonometric Ratios and Special Right Triangles",
          "Applications Involving Right Triangles",
          "Radian Measures",
          "Arc Length and the Area of a Circle",
          "The Unit Circle",
          "Evaluate Trigonometric Functions Using the Unit Circle",
          "Evaluate Trigonometric Functions Given a Point",
          "Find Reference Angles",
          "Use Reference Angles to Evaluate Trigonometric Functions",
        ],
      },
      {
        unit: "Unit 6: Graphs and Inverses of Trigonometric Functions",
        lessons: [
          "Sine and Cosine Curves",
          "Amplitude and Period",
          "Translations of Sine and Cosine Curves",
          "Graph of the Tangent Function",
          "Graph of the Cotangent Function",
          "Graph of Secant",
          "Graph of the Cosecant Function",
          "Inverse Sine and Cosine Functions",
          "Inverse Tangent Function",
        ],
      },
      {
        unit: "Unit 7: Analytic Trigonometry",
        lessons: [
          "Basic Trigonometric Identities",
          "Simplifying Trigonometric Expressions",
          "Factoring Trigonometric Expressions",
          "Combining Rational Trigonometric Expressions",
          "Finding Trigonometric Values",
          "Verifying Trigonometric Identities",
          "Using Standard Algebraic Techniques to Solve Trigonometric Identities",
          "Solving Quadratic Trigonometric Equations",
          "Solving Trigonometric Equations Involving Multiple Angles",
          "Using Sum and Difference Formulas to Evaluate Trigonometric Functions",
          "Using Sum and Difference Formulas to Verify Identities and Solve Trigonometric Equations",
        ],
      },
      {
        unit: "Unit 8: Additional Topics in Trigonometry",
        lessons: [
          "Using the Law of Sines and Law of Cosines to Solve an Oblique Triangle",
          "Applications of the Law of Sines and Law of Cosines",
          "Finding the Area of an Oblique Triangle",
        ],
      },
      {
        unit: "Unit 9: Additional Topics for Advanced Mathematics",
        lessons: [
          "Vectors and Vector Operations",
          "Unit Vectors and Directional Analysis",
          "Application of Vectors",
          "Parametric Equations",
          "Limits of Functions",
          "The Complex Number System",
        ],
      },
    ],
  },
  calculus: {
    title: "Calculus",
    description:
      "A comprehensive AP-level calculus course covering limits, derivatives, integrals, differential equations, and applications — aligned with both AB and BC curriculum tracks.",
    contents: [
      {
        unit: "Unit 0 – Calc Prerequisites",
        lessons: ["0.1 Summer Packet"],
      },
      {
        unit: "Unit 1 – Limits and Continuity",
        lessons: [
          "1.1 Can Change Occur at an Instant?",
          "1.2 Defining Limits and Using Limit Notation",
          "1.3 Estimating Limit Values from Graphs",
          "1.4 Estimating Limit Values from Tables",
          "1.5 Determining Limits Using Algebraic Properties",
          "1.6 Determining Limits Using Algebraic Manipulation",
          "1.7 Selecting Procedures for Determining Limits",
          "1.8 Determining Limits Using the Squeeze Theorem",
          "1.9 Connecting Multiple Representations of Limits",
          "Mid-Unit Review – Unit 1",
          "1.10 Exploring Types of Discontinuities",
          "1.11 Defining Continuity at a Point",
          "1.12 Confirming Continuity Over an Interval",
          "1.13 Removing Discontinuities",
          "1.14 Infinite Limits and Vertical Asymptotes",
          "1.15 Limits at Infinity and Horizontal Asymptotes",
          "1.16 Intermediate Value Theorem (IVT)",
          "Review – Unit 1",
        ],
      },
      {
        unit: "Unit 2 – Differentiation: Definition and Fundamental Properties",
        lessons: [
          "2.1 Average and Instantaneous Rate of Change",
          "2.2 Defining the Derivative of a Function",
          "2.3 Estimating Derivatives at a Point",
          "2.4 Connecting Differentiability and Continuity",
          "2.5 Applying the Power Rule",
          "2.6 Derivative Rules (Sum, Difference, Constant)",
          "2.7 Derivatives of cos(x), sin(x), e^x, ln(x)",
          "2.8 The Product Rule",
          "2.9 The Quotient Rule",
          "2.10 Derivatives of tan(x), cot(x), sec(x), csc(x)",
          "Review – Unit 2",
        ],
      },
      {
        unit: "Unit 3 – Differentiation: Composite, Implicit, and Inverse Functions",
        lessons: [
          "3.1 The Chain Rule",
          "3.2 Implicit Differentiation",
          "3.3 Differentiating Inverse Functions",
          "3.4 Differentiating Inverse Trig Functions",
          "3.5 Selecting Derivative Procedures",
          "3.6 Higher-Order Derivatives",
          "Review – Unit 3",
        ],
      },
      {
        unit: "Unit 4 – Contextual Applications of Differentiation",
        lessons: [
          "4.1 Derivative Meaning in Context",
          "4.2 Position, Velocity, and Acceleration",
          "4.3 Other Rates of Change",
          "4.4 Related Rates Intro",
          "4.5 Solving Related Rates Problems",
          "4.6 Local Linearity & Linearization",
          "4.7 L'Hopital's Rule for Limits",
          "Review – Unit 4",
        ],
      },
      {
        unit: "Unit 5 – Analytical Applications of Differentiation",
        lessons: [
          "5.1 Mean Value Theorem",
          "5.2 Global vs Local Extrema",
          "5.3 Intervals of Increase/Decrease",
          "5.4 First Derivative Test",
          "5.5 Candidates Test for Absolute Extrema",
          "5.6 Determining Concavity",
          "5.7 Second Derivative Test",
          "Mid-Unit Review – Unit 5",
          "5.8 Graphing Functions and Derivatives",
          "5.9 Connecting f, f', and f''",
          "5.10 Optimization Problems Intro",
          "5.11 Solving Optimization Problems",
          "5.12 Implicit Relation Behaviors",
          "Review – Unit 5",
        ],
      },
      {
        unit: "Unit 6 – Integration and Accumulation of Change",
        lessons: [
          "6.1 Exploring Accumulation of Change",
          "6.2 Approximating Areas with Riemann Sums",
          "6.3 Summation Notation and Definite Integrals",
          "6.4 Fundamental Theorem of Calculus (FTC)",
          "6.5 Accumulation Functions and Area",
          "Mid-Unit Review – Unit 6",
          "6.6 Properties of Definite Integrals",
          "6.7 Definite Integrals and the FTC",
          "6.8 Basic Antiderivatives and Notation",
          "6.9 Substitution Method",
          "6.10 Long Division & Completing Square",
          "6.11 Integration by Parts (BC)",
          "6.12 Linear Partial Fractions (BC)",
          "6.13 Improper Integrals (BC)",
          "6.14 Choosing Antidifferentiation Methods",
          "Review – Unit 6",
        ],
      },
      {
        unit: "Unit 7 – Differential Equations",
        lessons: [
          "7.1 Modeling with Differential Equations",
          "7.2 Verifying Solutions",
          "7.3 Slope Fields",
          "7.4 Reasoning with Slope Fields",
          "7.5 Euler's Method (BC)",
          "7.6 General Solutions via Separation of Variables",
          "7.7 Particular Solutions with Initial Conditions",
          "7.8 Exponential Models",
          "7.9 Logistic Models (BC)",
          "Review – Unit 7",
        ],
      },
      {
        unit: "Unit 8 – Applications of Integration",
        lessons: [
          "8.1 Average Value on an Interval",
          "8.2 Motion: Velocity and Acceleration",
          "8.3 Area and Accumulation Applications",
          "8.4 Area Between Curves (x)",
          "8.5 Area Between Curves (y)",
          "8.6 Area with >2 Intersections",
          "Mid-Unit Review – Unit 8",
          "8.7 Cross Sections: Squares/Rectangles",
          "8.8 Cross Sections: Triangles/Semicircles",
          "8.9 Disc Method: x-/y-Axis",
          "8.10 Disc Method: Other Axes",
          "8.11 Washer Method: x-/y-Axis",
          "8.12 Washer Method: Other Axes",
          "8.13 Arc Length & Distance (BC)",
          "Review – Unit 8",
        ],
      },
      {
        unit: "Unit 9 – Parametric, Polar, and Vector Functions (BC)",
        lessons: [
          "9.1 Parametric Derivatives",
          "9.2 Second Derivatives (Parametric)",
          "9.3 Arc Lengths (Parametric)",
          "9.4 Vector-Valued Derivatives",
          "9.5 Vector-Valued Integrals",
          "9.6 Parametric & Vector Motion",
          "9.7 Polar Coordinates and Derivatives",
          "9.8 Area of Polar Regions",
          "9.9 Area Between Polar Curves",
          "Review – Unit 9",
        ],
      },
      {
        unit: "Unit 10 – Infinite Sequences and Series (BC)",
        lessons: [
          "10.1 Convergent vs Divergent Series",
          "10.2 Geometric Series",
          "10.3 nth Term Test",
          "10.4 Integral Test",
          "10.5 Harmonic and p-Series",
          "10.6 Comparison Tests",
          "10.7 Alternating Series Test",
          "10.8 Ratio Test",
          "10.9 Absolute vs Conditional Convergence",
          "Mid-Unit Review – Unit 10",
          "10.10 Alternating Series Error Bound",
          "10.11 Taylor Polynomial Approximations",
          "10.12 Lagrange Error Bound",
          "10.13 Radius/Interval of Convergence",
          "10.14 Taylor & Maclaurin Series",
          "10.15 Representing Functions as Power Series",
          "Review – Unit 10",
        ],
      },
    ],
  },
  "geometry-trigonometry": {
    title: "Geometry & Trigonometry",
    description:
      "A complete course covering foundational geometry, triangle properties, right triangle trigonometry, quadrilaterals, circles, polygons, 3D figures, and transformations.",
    contents: [
      {
        unit: "Part 1 – Geometry",
        lessons: [],
      },
      {
        unit: "Unit 1: Introduction to Geometry",
        lessons: [
          "1.1 Points, Lines, & Planes",
          "1.2 Measuring Segments",
          "1.3 Measuring & Classifying Angles",
          "1.4 Angle Pair Relationships",
          "1.5 Classifying Polygons",
        ],
      },
      {
        unit: "Unit 2: Reasoning & Proof",
        lessons: [
          "2.1 Inductive Reasoning",
          "2.2 Deductive Reasoning",
          "2.3 Conditional Statements",
          "2.4 Proving Angles Congruent",
        ],
      },
      {
        unit: "Unit 3: Perpendicular & Parallel Lines",
        lessons: [
          "3.1 Parallel Lines with Transversals",
          "3.2 Proving Lines Parallel",
          "3.3 Parallel vs. Perpendicular Using Slope",
          "3.4 Write Equations of Lines",
        ],
      },
      {
        unit: "Unit 4: Congruent Triangles",
        lessons: [
          "4.1 Congruent Figures",
          "4.2 Congruent Triangles by SSS and SAS",
          "4.3 Congruent Triangles by AAS, ASA, and HL",
          "4.4 Isosceles and Equilateral Triangles",
          "4.5 Corresponding Parts of Congruent Triangles",
        ],
      },
      {
        unit: "Unit 5: Anatomy of Triangles",
        lessons: [
          "5.1 Mid-segments of Triangles",
          "5.2 Perpendicular Bisectors of Triangles",
          "5.3 Angle Bisectors of Triangles",
          "5.4 Medians and Altitudes",
          "5.5 Inequalities in One Triangle",
          "5.6 Inequalities in Two Triangles",
        ],
      },
      {
        unit: "Unit 6: Similarity",
        lessons: [
          "6.1 Ratios and Proportions",
          "6.2 The Geometric Mean",
          "6.3 Similar Polygons",
          "6.4 Prove Triangles Similar by AA",
          "6.5 Prove Triangles Similar by SSS and SAS",
          "6.6 Similarity in Right Triangles",
        ],
      },
      {
        unit: "Part 2 – Trigonometry",
        lessons: [],
      },
      {
        unit: "Unit 1: Right Triangles and Trigonometry",
        lessons: [
          "1.1 Pythagorean Theorem",
          "1.2 Special Right Triangles",
          "1.3 Trigonometric Functions (Sin, Cos, Tan, Sec, CSC, Cot)",
          "1.4 Angles of Elevation and Depression",
        ],
      },
      {
        unit: "Unit 2: Quadrilaterals & Other Polygons",
        lessons: [
          "2.1 Polygon Angle Sum Theorem",
          "2.2 Interior and Exterior Angles of Regular Polygons",
          "2.3 Parallelograms",
          "2.4 Rhombuses, Rectangles, and Squares",
          "2.5 Trapezoids and Kites",
          "2.6 Convex vs. Concave Polygons",
        ],
      },
      {
        unit: "Unit 3: Circles",
        lessons: [
          "3.1 Tangent Lines",
          "3.2 Chords",
          "3.3 Secant Lines",
          "3.4 Finding Arc Measures",
          "3.5 Inscribed Angles",
          "3.6 Angle Measures and Segment Lengths",
          "3.7 Graphing Circles on the Coordinate Plane",
          "3.8 Areas and Circumferences of Circles",
        ],
      },
      {
        unit: "Unit 4: Areas & Perimeters of Polygons",
        lessons: [
          "4.1 Perimeters of Polygons",
          "4.2 Areas of Triangles",
          "4.3 Areas of Parallelograms",
          "4.4 Areas of Rhombuses",
          "4.5 Areas of Kites",
          "4.6 Areas of Regular Polygons",
          "4.7 Trapezoids",
          "4.8 Areas of Sectors of Circles",
          "4.9 Arc Lengths in Circles",
        ],
      },
      {
        unit: "Unit 5: Surface Area & Volume",
        lessons: [
          "5.1 Surface Area of Prisms",
          "5.2 Surface Area of Cylinders",
          "5.3 Surface Area of Pyramids",
          "5.4 Surface Area of Cones",
          "5.5 Volumes of Prisms",
          "5.6 Volumes of Cylinders",
          "5.7 Volumes of Pyramids",
          "5.8 Volumes of Cones",
          "5.9 Surface Area and Volume of Spheres",
        ],
      },
      {
        unit: "Unit 6: Transformations",
        lessons: [
          "6.1 Translations, Reflections, and Rotations",
          "6.2 Dilations",
          "6.3 Symmetry",
          "6.4 Composition of Transformations",
        ],
      },
    ],
  },

  "statistics-probability": {
    title: "Statistics & Probability",
    description:
      "This course introduces students to the principles of statistics and probability including data analysis, measures of center and spread, modeling distributions, bivariate data, study design, and combinatorics.",
    contents: [
      {
        unit: "Unit 1: Analyzing Categorical Data",
        lessons: [
          "Individuals, variables, and categorical & quantitative data",
          "Read picture graphs",
          "Create bar graphs",
          "Read bar graphs and solve 2-step problems",
          "Read two-way frequency tables",
          "Create two-way frequency tables",
          "Create two-way relative frequency tables",
          "Reading two-way relative frequency tables",
          "Interpreting two-way tables",
          "Identifying marginal and conditional distributions",
          "Marginal distributions",
          "Conditional distributions",
        ],
      },
      {
        unit: "Unit 2: Displaying and Comparing Quantitative Data",
        lessons: [
          "Create frequency tables",
          "Create dot plots",
          "Reading dot plots & frequency tables",
          "Create histograms",
          "Comparing data displays",
          "Comparing data distributions",
          "Read histograms",
          "Reading stem and leaf plots",
          "Shape of distributions",
          "Clusters, gaps, peaks, & outliers",
          "Comparing distributions",
          "Comparing center and spread",
        ],
      },
      {
        unit: "Unit 3: Summarizing Quantitative Data",
        lessons: [
          "Mean, median, and mode",
          "Calculating the mean",
          "Calculating the median",
          "Calculating the mean: data displays",
          "Calculating the median: data displays",
          "Effects of shifting, adding, & removing a data point",
          "Missing value given the mean",
          "Median & range puzzlers",
          "Interquartile range (IQR)",
          "Standard deviation of a population",
          "Variance",
          "Sample and population standard deviation",
          "Creating box plots",
          "Reading box plots",
          "Interpreting quartiles",
          "Identifying outliers",
          "Mean absolute deviation (MAD)",
        ],
      },
      {
        unit: "Unit 4: Modeling Data Distributions",
        lessons: [
          "Calculating percentiles",
          "Calculating z-scores",
          "Transforming data",
          "Properties of density curves",
          "Area under density curves",
          "Empirical rule",
          "Normal distribution: Area above or below a point",
          "Normal distribution: Area between two points",
          "Normal calculations in reverse",
        ],
      },
      {
        unit: "Unit 5: Exploring Bivariate Numerical Data",
        lessons: [
          "Constructing scatter plots",
          "Making appropriate scatter plots",
          "Positive and negative linear associations from scatter plots",
          "Describing trends in scatter plots",
          "Correlation coefficient intuition",
          "Eyeballing line of best fit",
          "Estimating equations of lines of best fit, and using them to make predictions",
          "Estimating slope of line of best fit",
          "Calculating and interpreting residuals",
          "Calculating the equation of the least-square line",
          "Interpreting slope and y-intercept for linear models",
          "Residual plots",
          "Influential points",
        ],
      },
      {
        unit: "Unit 6: Study Design",
        lessons: [
          "Statistical questions",
          "Valid claims",
          "Identifying the population and sample",
          "Using probability to make fair decisions",
          "Simple random samples",
          "Making inferences from random samples",
          "Sampling methods",
          "Types of statistical studies",
          "Experiment designs",
        ],
      },
      {
        unit: "Unit 7: Probability",
        lessons: [
          "Simple probability",
          "Comparing probability",
          "Subsets of sample spaces",
          "Basic set notation",
          "Experimental probability",
          "Making predictions with probability",
          "Interpreting results of simulations",
          "Adding probabilities",
          "Two-way tables, Venn diagrams, and probability",
          "Sample spaces for compound events",
          "Independent probability",
          "Probabilities of compound events",
          "Probability of “at least one” success",
          "Dependent probability",
          "Calculating conditional probability",
          "Dependent and independent events",
        ],
      },
      {
        unit: "Unit 8: Counting, Permutations, and Combinations",
        lessons: [
          "The counting principle",
          "Permutations",
          "Combinations",
          "Permutations and combinations",
          "Probability with permutations and combinations",
        ],
      },
    ],
  },

  // You can add more courses later like:
  // "Pre-Calculus": { title: "Pre-Calculus ", contents: [...] }
};


const CourseDetail = () => {
  const { id } = useParams();
  // const navigate = useNavigate();
  const course = courseData[id];
  const user = JSON.parse(localStorage.getItem("user"));

  const isStudent = user?.role === "student";
  const courseNumericId = slugToIdMap[id];

  if (!course) return <div className="error">❌ Course not found.</div>;

  return (
    <div className="course-detail">
      <div className="course-header">
        <h1>{course.title}</h1>
        <p className="course-description">{course.description}</p>
      </div>

      <div className="course-content">
        {course.contents.map((section, index) => (
          <div className="unit-card" key={index}>
            <h2 className="unit-title">{section.unit}</h2>
            <ul className="lesson-list">
              {section.lessons.map((lesson, idx) => (
                <li key={idx} className="lesson-item">
                  {lesson}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="course-footer">
        {isStudent && (
          <Link to={`/payment/${courseNumericId}`} className="btn-enroll">
            Enroll Now
          </Link>
        )}
        <Link to="/courses" className="btn-back">
          ← Back to Courses
        </Link>
      </div>
    </div>
  );
};

export default CourseDetail;