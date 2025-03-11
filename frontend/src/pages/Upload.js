import React, { useState, useEffect } from "react";
import axios from "axios";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel styles
import { Carousel } from "react-responsive-carousel"; // Import Carousel component

const Upload = () => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [uploads, setUploads] = useState([]);
  const token = localStorage.getItem("token");

  // Fetch uploaded files from backend
  const fetchUploads = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/progress/files", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUploads(res.data);
    } catch (error) {
      console.error("Error fetching uploads:", error);
    }
  };

  useEffect(() => {
    fetchUploads();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("description", description);

    try {
      await axios.post("http://localhost:5000/api/progress/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("File uploaded successfully!");
      setFile(null);
      setDescription("");
      fetchUploads(); // Refresh uploaded progress
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    }
  };

  const handleLike = async (progressId) => {
    try {
      await axios.post(`http://localhost:5000/api/progress/${progressId}/like`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUploads(); // Refresh uploads
    } catch (error) {
      console.error("Failed to like progress:", error);
    }
  };

  const handleComment = async (progressId, text) => {
    try {
      await axios.post(`http://localhost:5000/api/progress/${progressId}/comment`, { text }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUploads(); // Refresh uploads
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  return (
    <div>
      <h2>📤 Upload Progress</h2>
      {/* Upload Form */}
      <div className="mb-3">
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

      <h2>📸 Uploaded Progress</h2>
      {/* Display Uploaded Progress */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {uploads.length > 0 ? (
          uploads.map((upload) => (
            <div key={upload._id} style={{ textAlign: "center" }}>
              {upload.fileType === "image" ? (
                <img
                  src={upload.fileUrl}
                  alt="Gym Progress"
                  style={{
                    width: "200px",
                    height: "200px",
                    objectFit: "cover",
                    border: "1px solid black",
                    borderRadius: "8px",
                  }}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/200?text=Image+Not+Found";
                  }}
                />
              ) : (
                <video width="200" controls>
                  <source src={upload.fileUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
              <p>{upload.description}</p>

              {/* Like Button */}
              <button
                onClick={() => handleLike(upload._id)}
                className="btn btn-primary"
              >
                👍 Like ({upload.likes.length})
              </button>

              {/* Comments Section */}
              <div className="mt-3">
                <h5>💬 Comments</h5>
                {upload.comments.map((comment, index) => (
                  <div key={index} className="mb-2">
                    <p>{comment.text}</p>
                    <small className="text-muted">
                      Commented by: {comment.username}
                    </small>
                  </div>
                ))}

                {/* Add Comment Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const commentText = e.target.comment.value;
                    handleComment(upload._id, commentText);
                    e.target.comment.value = ""; // Clear the input
                  }}
                >
                  <input
                    type="text"
                    name="comment"
                    placeholder="Add a comment..."
                    className="form-control mb-2"
                    required
                  />
                  <button type="submit" className="btn btn-secondary">
                    Add Comment
                  </button>
                </form>
              </div>
            </div>
          ))
        ) : (
          <p>No uploads found.</p>
        )}
      </div>

      {/* Progress Timeline */}
      <h2>📅 Progress Timeline</h2>
      <div className="mt-4">
        {uploads.length > 0 ? (
          <Carousel showThumbs={false} infiniteLoop={true}>
            {uploads.map((upload) => (
              <div key={upload._id} style={{ textAlign: "center" }}>
                {upload.fileType === "image" ? (
                  <img
                    src={upload.fileUrl}
                    alt="Gym Progress"
                    style={{
                      width: "100%",
                      height: "400px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400?text=Image+Not+Found";
                    }}
                  />
                ) : (
                  <video width="100%" controls>
                    <source src={upload.fileUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
                <p>{upload.description}</p>
                <small className="text-muted">
                  Uploaded on: {new Date(upload.createdAt).toLocaleString()}
                </small>
              </div>
            ))}
          </Carousel>
        ) : (
          <p>No uploads found for the timeline.</p>
        )}
      </div>
    </div>
  );
};

export default Upload;
