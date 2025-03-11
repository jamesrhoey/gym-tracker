import React, { useState, useEffect } from "react";
import axios from "axios";

const UploadedProgress = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    const fetchUploadedFiles = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/progress/files", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUploadedFiles(res.data);
      } catch (error) {
        console.error("Failed to fetch uploads:", error);
      }
    };
    fetchUploadedFiles();
  }, []);

  return (
    <div>
      <h4>📸 Uploaded Progress</h4>
      {uploadedFiles.length === 0 ? (
        <p>No uploaded progress yet.</p>
      ) : (
        uploadedFiles.map((file) => (
          <div key={file._id} className="mb-3">
            <img src={file.fileUrl} alt="Progress" className="img-fluid rounded shadow-sm" />
            <p>{file.description}</p>
            <p className="text-muted">
              Uploaded on: {new Date(file.createdAt).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default UploadedProgress;
