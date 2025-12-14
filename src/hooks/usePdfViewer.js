// import { useCallback } from "react";

// /**
//  * Custom hook for handling PDF viewing with Cloudinary optimization
//  */
// const usePdfViewer = () => {
//   /**
//    * Optimize Cloudinary URL for PDF viewing
//    */
//   const optimizeCloudinaryUrl = useCallback((url) => {
//     if (!url || typeof url !== "string") return url;

//     let optimizedUrl = url;

//     // Handle Cloudinary URLs
//     if (optimizedUrl.includes("cloudinary.com")) {
//       // Convert raw upload to image upload for better compatibility
//       if (optimizedUrl.includes("/raw/upload/")) {
//         optimizedUrl = optimizedUrl.replace("/raw/upload/", "/image/upload/");
//       }

//       // Ensure .pdf extension
//       if (!optimizedUrl.toLowerCase().includes(".pdf")) {
//         const hasQuery = optimizedUrl.includes("?");
//         optimizedUrl = hasQuery
//           ? optimizedUrl.replace("?", ".pdf?")
//           : optimizedUrl + ".pdf";
//       }

//       // Add optimization flags
//       const separator = optimizedUrl.includes("?") ? "&" : "?";
//       optimizedUrl += `${separator}flags=layer_apply`;
//     }

//     return optimizedUrl;
//   }, []);

//   /**
//    * Open PDF in new tab
//    */
//   const openPdfInNewTab = useCallback(
//     (url, title = "PDF Document") => {
//       const optimizedUrl = optimizeCloudinaryUrl(url);

//       if (!optimizedUrl) {
//         console.error("Invalid PDF URL");
//         return false;
//       }

//       const newTab = window.open(optimizedUrl, "_blank", "noopener,noreferrer");

//       if (!newTab) {
//         // Handle popup blockers
//         alert("Please allow popups for this site to view PDFs");
//         return false;
//       }

//       return true;
//     },
//     [optimizeCloudinaryUrl]
//   );

//   /**
//    * Get PDF download link
//    */
//   const getPdfDownloadLink = useCallback((url, filename = "document.pdf") => {
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = filename;
//     link.target = "_blank";
//     link.rel = "noopener noreferrer";
//     return link;
//   }, []);

//   /**
//    * Check if URL is a Cloudinary PDF
//    */
//   const isCloudinaryPdf = useCallback((url) => {
//     return (
//       url?.includes("cloudinary.com") &&
//       (url.includes("/pdfs/") ||
//         url.includes(".pdf") ||
//         url.includes("/raw/upload/"))
//     );
//   }, []);

//   return {
//     optimizeCloudinaryUrl,
//     openPdfInNewTab,
//     getPdfDownloadLink,
//     isCloudinaryPdf,
//   };
// };

// export default usePdfViewer;




import { useCallback } from "react";

/**
 * Custom hook for handling PDF viewing with Cloudinary optimization
 */
const usePdfViewer = () => {
  /**
   * Optimize Cloudinary URL for PDF viewing
   */
  const optimizeCloudinaryUrl = useCallback((url) => {
    if (!url || typeof url !== "string") return url;

    let optimizedUrl = url;

    // Handle Cloudinary URLs
    if (optimizedUrl.includes("cloudinary.com")) {
      // Convert raw upload to image upload for better compatibility
      if (optimizedUrl.includes("/raw/upload/")) {
        optimizedUrl = optimizedUrl.replace("/raw/upload/", "/image/upload/");
      }

      // Ensure .pdf extension
      if (!optimizedUrl.toLowerCase().includes(".pdf")) {
        const hasQuery = optimizedUrl.includes("?");
        optimizedUrl = hasQuery
          ? optimizedUrl.replace("?", ".pdf?")
          : optimizedUrl + ".pdf";
      }

      // Add optimization flags
      const separator = optimizedUrl.includes("?") ? "&" : "?";
      optimizedUrl += `${separator}flags=layer_apply`;
    }

    return optimizedUrl;
  }, []);

  /**
   * Open PDF in new tab
   */
  const openPdfInNewTab = useCallback(
    (url, title = "PDF Document") => {
      const optimizedUrl = optimizeCloudinaryUrl(url);

      if (!optimizedUrl) {
        console.error("Invalid PDF URL");
        return false;
      }

      const newTab = window.open(optimizedUrl, "_blank", "noopener,noreferrer");

      if (!newTab) {
        // Handle popup blockers
        alert("Please allow popups for this site to view PDFs");
        return false;
      }

      return true;
    },
    [optimizeCloudinaryUrl]
  );

  /**
   * Get PDF download link
   */
  const getPdfDownloadLink = useCallback((url, filename = "document.pdf") => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    return link;
  }, []);

  /**
   * Check if URL is a Cloudinary PDF
   */
  const isCloudinaryPdf = useCallback((url) => {
    return (
      url?.includes("cloudinary.com") &&
      (url.includes("/pdfs/") ||
        url.includes(".pdf") ||
        url.includes("/raw/upload/"))
    );
  }, []);

  return {
    optimizeCloudinaryUrl,
    openPdfInNewTab,
    getPdfDownloadLink,
    isCloudinaryPdf,
  };
};

export default usePdfViewer;