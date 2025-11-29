// // src/components/PreviewButton.jsx
// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@mui/material";

// const PreviewButton = ({ lessonId }) => {
//   const navigate = useNavigate();

//   return (
//     <Button
//       variant="outlined"
//       size="small"
//       onClick={() => navigate(`/teacher/preview/${lessonId}`)}
//     >
//       Preview
//     </Button>
//   );
// };

// export default PreviewButton;




// src/components/PreviewButton.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Button } from "@mui/material";

const PreviewButton = ({ lessonId }) => {
  const navigate = useNavigate();

  return (
    <Button
      size="small"
      variant="outlined"
      startIcon={<VisibilityIcon />}
      sx={{ ml: 1 }}
      onClick={(e) => {
        e.stopPropagation();
        navigate(`/lessons/${lessonId}/preview`);
      }}
    >
      Preview
    </Button>
  );
};

export default PreviewButton;
