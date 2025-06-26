// ✅ FileManager.jsx - Teachers/Admins only
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const FileManager = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFiles = async () => {
    try {
      const res = await axios.get("/api/v1/files");
      setFiles(res.data.files);
    } catch (err) {
      toast.error("Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (filename) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    try {
      await axios.delete(`/api/v1/files/${filename}`);
      toast.success("File deleted");
      fetchFiles();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="file-manager">
      <h2>📁 Uploaded Files</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {files.map((file) => (
            <li key={file}>
              <a href={`/uploads/${file}`} target="_blank" rel="noreferrer">
                {file}
              </a>
              <button onClick={() => deleteFile(file)}>🗑️ Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileManager;
