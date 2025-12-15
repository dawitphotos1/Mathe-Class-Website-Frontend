
import React from "react";
import PdfPreviewButton from "./PdfPreviewButton";

const TestPdfButton = () => {
  const testLesson = {
    id: 5788,
    title: "0.1 Solving Simple Equations",
    fileUrl:
      "https://res.cloudinary.com/dt6otim5b/raw/upload/v1765734819/mathe-class/pdfs/file_zzil6w",
  };

  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #ccc",
        margin: "20px",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h3 style={{ marginBottom: "20px" }}>Test PDF Preview Button</h3>

      <div style={{ marginBottom: "20px" }}>
        <h4>Current lesson data:</h4>
        <pre
          style={{
            backgroundColor: "#fff",
            padding: "10px",
            borderRadius: "4px",
            overflow: "auto",
          }}
        >
          {JSON.stringify(testLesson, null, 2)}
        </pre>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h4>Main button:</h4>
        <PdfPreviewButton lesson={testLesson} />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h4>All variants:</h4>
        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginBottom: "10px",
          }}
        >
          <PdfPreviewButton lesson={testLesson} variant="default" />
          <PdfPreviewButton lesson={testLesson} variant="primary" />
          <PdfPreviewButton lesson={testLesson} variant="teacher" />
          <PdfPreviewButton lesson={testLesson} variant="student" />
          <PdfPreviewButton lesson={testLesson} variant="outline" />
        </div>
      </div>

      <div>
        <h4>All sizes:</h4>
        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
          }}
        >
          <PdfPreviewButton lesson={testLesson} size="small" />
          <PdfPreviewButton lesson={testLesson} size="medium" />
          <PdfPreviewButton lesson={testLesson} size="large" />
        </div>
      </div>
    </div>
  );
};

export default TestPdfButton;