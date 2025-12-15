
import React, { useState } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import PdfPreviewButton from "./PdfPreviewButton";

/**
 * PDF Viewer Modal - Opens PDF in modal with download option
 */
const PdfViewerModal = ({ lesson, triggerButton = true }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  /**
   * Get optimized PDF URL for Cloudinary
   */
  const getOptimizedPdfUrl = () => {
    if (!lesson?.fileUrl) return null;

    let url = lesson.fileUrl;

    if (url.includes("cloudinary.com")) {
      // Use image upload for better compatibility with iframe
      if (url.includes("/raw/upload/")) {
        url = url.replace("/raw/upload/", "/image/upload/");
      }

      if (!url.toLowerCase().includes(".pdf")) {
        if (url.includes("?")) {
          url = url.replace("?", ".pdf?");
        } else {
          url += ".pdf";
        }
      }

      const separator = url.includes("?") ? "&" : "?";
      url += `${separator}flags=layer_apply`;
    }

    return url;
  };

  const pdfUrl = getOptimizedPdfUrl();

  if (!pdfUrl) {
    return triggerButton ? (
      <PdfPreviewButton lesson={lesson} variant="outline" />
    ) : null;
  }

  return (
    <>
      {/* Trigger Button */}
      {triggerButton && (
        <PdfPreviewButton
          lesson={lesson}
          variant="primary"
          onClick={handleOpen}
        />
      )}

      {/* Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="pdf-viewer-modal"
        aria-describedby="pdf-document-viewer"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "95vw",
            height: "95vh",
            maxWidth: "1200px",
            maxHeight: "800px",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: "12px",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px 24px",
              borderBottom: "1px solid #e0e0e0",
              backgroundColor: "#f8f9fa",
            }}
          >
            <Box sx={{ flex: 1 }}>
              <h3 style={{ margin: 0, fontSize: "18px", color: "#333" }}>
                {lesson.title}
              </h3>
              <p style={{ margin: "4px 0 0", fontSize: "14px", color: "#666" }}>
                PDF Document Preview
              </p>
            </Box>

            <Box sx={{ display: "flex", gap: "8px" }}>
              {/* Download Button */}
              <IconButton
                onClick={() => window.open(lesson.fileUrl, "_blank")}
                title="Download PDF"
                sx={{
                  backgroundColor: "#f0f0f0",
                  "&:hover": { backgroundColor: "#e0e0e0" },
                }}
              >
                <DownloadIcon />
              </IconButton>

              {/* Open in New Tab */}
              <IconButton
                onClick={() => window.open(pdfUrl, "_blank")}
                title="Open in New Tab"
                sx={{
                  backgroundColor: "#f0f0f0",
                  "&:hover": { backgroundColor: "#e0e0e0" },
                }}
              >
                <OpenInNewIcon />
              </IconButton>

              {/* Close Button */}
              <IconButton
                onClick={handleClose}
                title="Close"
                sx={{
                  backgroundColor: "#f0f0f0",
                  "&:hover": { backgroundColor: "#e0e0e0" },
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          {/* PDF Viewer */}
          <Box sx={{ flex: 1, position: "relative" }}>
            <iframe
              src={pdfUrl}
              title={`PDF Viewer - ${lesson.title}`}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
              }}
              allow="fullscreen"
              loading="lazy"
            />

            {/* Loading/Error overlay */}
            <Box
              id="pdf-loading"
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                zIndex: 1,
                visibility: "hidden",
              }}
            >
              <p>Loading PDF...</p>
            </Box>
          </Box>

          {/* Footer */}
          <Box
            sx={{
              padding: "12px 24px",
              borderTop: "1px solid #e0e0e0",
              backgroundColor: "#f8f9fa",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "14px", color: "#666" }}>
              Cloudinary PDF Viewer
            </span>

            <Box sx={{ display: "flex", gap: "12px" }}>
              <a
                href={lesson.fileUrl}
                download={`${lesson.title.replace(/[^a-z0-9]/gi, "_")}.pdf`}
                style={{
                  color: "#2196F3",
                  textDecoration: "none",
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <DownloadIcon fontSize="small" />
                Download Original
              </a>

              <button
                onClick={() => window.open(pdfUrl, "_blank")}
                style={{
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <OpenInNewIcon fontSize="small" />
                Open Full Screen
              </button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

PdfViewerModal.propTypes = {
  lesson: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    fileUrl: PropTypes.string,
  }).isRequired,
  triggerButton: PropTypes.bool,
};

export default PdfViewerModal;