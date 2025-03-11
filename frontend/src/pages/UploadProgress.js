import React, { useState } from "react";
import axios from "axios";

const UploadProgress = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("description", description);

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/progress/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("File uploaded successfully!");
      setFile(null);
      setDescription("");

      if (onUploadSuccess) onUploadSuccess(); // Refresh uploads after success
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    }
  };

  return (
    <div>
      <h4>📤 Upload Progress</h4>
      <input type="file" onChange={handleFileChange} className="form-control mb-2" />
      <input
        type="text"
        placeholder="Enter description..."
        className="form-control mb-2"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={handleUpload} className="btn btn-primary">Upload</button>
    </div>
  );
};

export default UploadProgress;
