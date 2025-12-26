// // src/components/SimplePdfViewer.jsx
// import React, { useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogTitle,
//   IconButton,
//   CircularProgress,
//   Box,
//   Typography,
// } from "@mui/material";
// import { Close, Download, OpenInNew } from "@mui/icons-material";

// const SimplePdfViewer = ({ open, onClose, pdfUrl, title }) => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(false);

//   const handleDownload = () => {
//     const link = document.createElement("a");
//     link.href = pdfUrl;
//     link.download = `${title.replace(/[^a-z0-9]/gi, "_")}.pdf`;
//     link.click();
//   };

//   const handleOpenInNewTab = () => {
//     window.open(pdfUrl, "_blank", "noopener,noreferrer");
//   };

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       maxWidth="lg"
//       fullWidth
//       PaperProps={{
//         style: {
//           height: "90vh",
//           maxHeight: "90vh",
//         },
//       }}
//     >
//       <DialogTitle
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           pr: 2,
//         }}
//       >
//         <Typography variant="h6">📄 {title}</Typography>
//         <Box>
//           <IconButton onClick={handleDownload} title="Download">
//             <Download />
//           </IconButton>
//           <IconButton onClick={handleOpenInNewTab} title="Open in new tab">
//             <OpenInNew />
//           </IconButton>
//           <IconButton onClick={onClose}>
//             <Close />
//           </IconButton>
//         </Box>
//       </DialogTitle>

//       <DialogContent sx={{ p: 0, position: "relative" }}>
//         {loading && (
//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               height: "100%",
//               position: "absolute",
//               top: 0,
//               left: 0,
//               right: 0,
//               bottom: 0,
//               bgcolor: "background.paper",
//             }}
//           >
//             <CircularProgress />
//           </Box>
//         )}

//         {error ? (
//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: "column",
//               justifyContent: "center",
//               alignItems: "center",
//               height: "100%",
//               p: 3,
//             }}
//           >
//             <Typography color="error" gutterBottom>
//               Failed to load PDF
//             </Typography>
//             <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
//               <button
//                 onClick={handleOpenInNewTab}
//                 style={{ padding: "8px 16px" }}
//               >
//                 Open in New Tab
//               </button>
//               <button onClick={handleDownload} style={{ padding: "8px 16px" }}>
//                 Download PDF
//               </button>
//             </Box>
//           </Box>
//         ) : (
//           <iframe
//             src={pdfUrl}
//             title={title}
//             style={{
//               width: "100%",
//               height: "100%",
//               border: "none",
//             }}
//             onLoad={() => setLoading(false)}
//             onError={() => {
//               setLoading(false);
//               setError(true);
//             }}
//           />
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default SimplePdfViewer;





// src/components/SimplePdfViewer.jsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  CircularProgress,
  Box,
  Typography
} from '@mui/material';
import { Close, Download, OpenInNew } from '@mui/icons-material';

const SimplePdfViewer = ({ open, onClose, pdfUrl, title }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${title.replace(/[^a-z0-9]/gi, '_')}.pdf`;
    link.click();
  };

  const handleOpenInNewTab = () => {
    window.open(pdfUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        style: {
          height: '90vh',
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pr: 2 
      }}>
        <Typography variant="h6">
          📄 {title}
        </Typography>
        <Box>
          <IconButton onClick={handleDownload} title="Download">
            <Download />
          </IconButton>
          <IconButton onClick={handleOpenInNewTab} title="Open in new tab">
            <OpenInNew />
          </IconButton>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0, position: 'relative' }}>
        {loading && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'background.paper'
          }}>
            <CircularProgress />
          </Box>
        )}
        
        {error ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center', 
            alignItems: 'center',
            height: '100%',
            p: 3
          }}>
            <Typography color="error" gutterBottom>
              Failed to load PDF
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <button onClick={handleOpenInNewTab} style={{ padding: '8px 16px' }}>
                Open in New Tab
              </button>
              <button onClick={handleDownload} style={{ padding: '8px 16px' }}>
                Download PDF
              </button>
            </Box>
          </Box>
        ) : (
          <iframe
            src={pdfUrl}
            title={title}
            style={{
              width: '100%',
              height: '100%',
              border: 'none'
            }}
            onLoad={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setError(true);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SimplePdfViewer;