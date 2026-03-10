import React, { useRef, useEffect, useState } from "react";
import "../components/Camera.css";
import { useNavigate } from "react-router-dom";

function CameraPage() {

  const navigate = useNavigate();

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [facingMode, setFacingMode] = useState("environment");
  const [zoom, setZoom] = useState(1);
  const [photo, setPhoto] = useState(null);
  const [mode, setMode] = useState("PHOTO");
  const [recentImages, setRecentImages] = useState([]);

  // START CAMERA
  useEffect(() => {

    startCamera();

    return () => {
      stopCamera();
    };

  }, [facingMode]);

  // LOAD RECENT IMAGES
  useEffect(() => {

    const images = JSON.parse(localStorage.getItem("recentImages")) || [];
    setRecentImages(images);

  }, []);

  const startCamera = async () => {

    try {

      stopCamera();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode
        }
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

    } catch (error) {
      console.error("Camera error:", error);
    }
  };

  // STOP CAMERA
  const stopCamera = () => {

    if (streamRef.current) {

      streamRef.current.getTracks().forEach(track => track.stop());

      streamRef.current = null;

    }

  };

  // CLOSE CAMERA BUTTON
  const closeCamera = () => {

    stopCamera();
    navigate("/home");

  };

  // REMOVE IMAGE
  const removeImage = (index) => {

    const updated = recentImages.filter((_, i) => i !== index);

    setRecentImages(updated);

    localStorage.setItem("recentImages", JSON.stringify(updated));

  };

  // CAPTURE PHOTO
  const capturePhoto = () => {

    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0);

    const imageData = canvas.toDataURL("image/png");

    setPhoto(imageData);

    const oldImages = JSON.parse(localStorage.getItem("recentImages")) || [];

    const updatedImages = [imageData, ...oldImages].slice(0, 4);

    localStorage.setItem("recentImages", JSON.stringify(updatedImages));

    setRecentImages(updatedImages);

    localStorage.setItem("capturedImage", imageData);

    stopCamera(); // CLOSE CAMERA BEFORE NAVIGATING

    navigate("/spot");

  };

  // FLIP CAMERA
  const flipCamera = () => {

    setFacingMode(prev =>
      prev === "environment" ? "user" : "environment"
    );

  };

  // ZOOM
  const changeZoom = (value) => {
    setZoom(value);
  };

  return (

    <div className="camera-page">

      {/* HEADER */}

      <div className="camera-header">
        <div className="close-btn" onClick={closeCamera}>
          ✕
        </div>
      </div>

      {/* CAMERA VIEW */}

      <div className="camera-view">

        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="camera-video"
          style={{ transform: `scale(${zoom})` }}
        />

      </div>

      {/* CAMERA CONTROLS */}

      <div className="camera-controls">

        <div className="mode-selector">

          <span
            className={mode === "SCAN" ? "active" : ""}
            onClick={() => setMode("SCAN")}
          >
            SCAN
          </span>

          <span
            className={mode === "PHOTO" ? "active" : ""}
            onClick={() => setMode("PHOTO")}
          >
            PHOTO
          </span>

          <span
            className={mode === "VIDEO" ? "active" : ""}
            onClick={() => setMode("VIDEO")}
          >
            VIDEO
          </span>

          <span
            className={mode === "PANO" ? "active" : ""}
            onClick={() => setMode("PANO")}
          >
            PANO
          </span>

        </div>

        {/* CAPTURE ROW */}

        <div className="capture-row">

          <div className="gallery-btn">
            {photo ? <img src={photo} alt="preview" /> : "🖼"}
          </div>

          <button
            className="capture-btn"
            onClick={capturePhoto}
          ></button>

          <div
            className="flip-btn"
            onClick={flipCamera}
          >
            🔄
          </div>

        </div>

        {/* ZOOM */}

        <div className="zoom-row">

          <span onClick={() => changeZoom(0.5)}>0.5x</span>

          <span
            className={zoom === 1 ? "active" : ""}
            onClick={() => changeZoom(1)}
          >
            1x
          </span>

          <span onClick={() => changeZoom(2)}>2x</span>

          <span onClick={() => changeZoom(5)}>5x</span>

        </div>

      </div>

      {/* RECENTLY SPOTTED */}

      <div className="recent-grid">

        {recentImages.map((img, index) => (

          <div className="recent-img" key={index}>

            <img src={img} alt="recent" />

            <button
              className="remove-btn"
              onClick={() => removeImage(index)}
            >
              ✕
            </button>

          </div>

        ))}

      </div>

    </div>

  );
}

export default CameraPage;