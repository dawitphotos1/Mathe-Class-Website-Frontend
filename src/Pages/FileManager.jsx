
// import React, { useEffect, useState } from "react";
// import axios from "../utils/axiosInstance"; // updated import
// import { toast } from "react-toastify";

// const FileManager = () => {
//   const [files, setFiles] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchFiles = async () => {
//     try {
//       const res = await axios.get("/files"); // removed /api/v1 prefix assuming axiosInstance baseURL handles it
//       setFiles(res.data.files);
//     } catch (err) {
//       toast.error("Failed to load files");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteFile = async (filename) => {
//     if (!window.confirm("Are you sure you want to delete this file?")) return;
//     try {
//       await axios.delete(`/files/${filename}`);
//       toast.success("File deleted");
//       fetchFiles();
//     } catch (err) {
//       toast.error("Delete failed");
//     }
//   };

//   React.useEffect(() => {
//     fetchFiles();
//   }, []);

//   return (
//     <div className="file-manager">
//       <h2>📁 Uploaded Files</h2>
//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <ul>
//           {files.map((file) => (
//             <li key={file}>
//               <a href={`/uploads/${file}`} target="_blank" rel="noreferrer">
//                 {file}
//               </a>
//               <button onClick={() => deleteFile(file)}>🗑️ Delete</button>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default FileManager;




import React, { useEffect, useState, useCallback } from "react";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";

const FileManager = () => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const fetchFiles = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/admin/files");
      setFiles(res.data.files || []);
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to load files.";
      setError(msg);
      toast.error(msg);
    }
  }, []);

  const handleDelete = async (fileId) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    try {
      await axiosInstance.delete(`/admin/files/${fileId}`);
      toast.success("🗑️ File deleted successfully");
      fetchFiles();
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to delete file.";
      toast.error(msg);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const containerClass = `p-6 rounded-lg shadow-md ${
    isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
  }`;

  const tableClass = `min-w-full border text-sm mt-4 ${
    isDark ? "border-gray-700 text-gray-200" : "border-gray-300 text-gray-800"
  }`;

  return (
    <div className={containerClass}>
      <h2 className="text-2xl font-bold mb-4">File Manager</h2>

      {error && <p className="text-red-400">{error}</p>}

      {files.length === 0 ? (
        <p className="text-gray-400">No files uploaded yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className={tableClass}>
            <thead>
              <tr className={isDark ? "bg-gray-700" : "bg-gray-200"}>
                <th className="px-4 py-2">Filename</th>
                <th className="px-4 py-2">Uploader</th>
                <th className="px-4 py-2">Uploaded At</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map((f) => (
                <tr
                  key={f.id}
                  className={isDark ? "border-gray-700" : "border-gray-300"}
                >
                  <td className="px-4 py-2">{f.filename}</td>
                  <td className="px-4 py-2">{f.uploader?.name || "N/A"}</td>
                  <td className="px-4 py-2">
                    {new Date(f.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <a
                      href={f.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    >
                      View
                    </a>
                    <button
                      onClick={() => handleDelete(f.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FileManager;
