
import React from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import {
  transformPdfUrl,
  downloadPdf,
  sanitizePdfFilename,
} from "../utils/pdfUtils";
import usePdfViewer from "../hooks/usePdfViewer";

/**
 * Lesson Card component with integrated PDF preview/download
 */
const LessonCardWithPdf = ({ lesson, onPreview, onDownload }) => {
  const { openPdfInNewTab, isCloudinaryPdf } = usePdfViewer();

  const handlePreview = () => {
    if (onPreview) {
      onPreview(lesson);
    } else {
      openPdfInNewTab(lesson.fileUrl, lesson.title);
    }
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload(lesson);
    } else {
      const filename = sanitizePdfFilename(lesson.title, lesson.id);
      downloadPdf(lesson.fileUrl, filename);
    }
  };

  const isPdfAvailable = !!lesson?.fileUrl;
  const isCloudinary = isCloudinaryPdf(lesson?.fileUrl);

  return (
    <Card
      sx={{
        maxWidth: 345,
        margin: 2,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
        },
      }}
    >
      <CardContent>
        <Typography gutterBottom variant="h6" component="div" noWrap>
          {lesson.title}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {lesson.contentType === "pdf" ? "PDF Document" : "Lesson Content"}
        </Typography>

        {/* PDF Status Indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px",
            backgroundColor: isPdfAvailable ? "#e8f5e9" : "#ffebee",
            borderRadius: "4px",
            marginBottom: "16px",
          }}
        >
          <PictureAsPdfIcon
            fontSize="small"
            color={isPdfAvailable ? "success" : "error"}
          />
          <Typography variant="caption">
            {isPdfAvailable
              ? `PDF Available ${isCloudinary ? "(Cloudinary)" : ""}`
              : "No PDF Available"}
          </Typography>
        </div>
      </CardContent>

      <CardActions sx={{ justifyContent: "space-between", padding: "16px" }}>
        <Button
          size="small"
          variant="contained"
          color="primary"
          startIcon={<VisibilityIcon />}
          onClick={handlePreview}
          disabled={!isPdfAvailable}
          sx={{ flex: 1, mr: 1 }}
        >
          Preview
        </Button>

        <Button
          size="small"
          variant="outlined"
          color="secondary"
          startIcon={<DownloadIcon />}
          onClick={handleDownload}
          disabled={!isPdfAvailable}
          sx={{ flex: 1 }}
        >
          Download
        </Button>
      </CardActions>
    </Card>
  );
};

LessonCardWithPdf.propTypes = {
  lesson: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    contentType: PropTypes.string,
    fileUrl: PropTypes.string,
  }).isRequired,
  onPreview: PropTypes.func,
  onDownload: PropTypes.func,
};

export default LessonCardWithPdf;