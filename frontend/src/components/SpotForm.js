import React, { useEffect, useState } from "react";
import "../components/SpotForm.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function SpotForm() {

  const navigate = useNavigate();

  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [locationName, setLocationName] = useState("Fetching location...");
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);

  useEffect(() => {

    const captured = localStorage.getItem("capturedImage");
    if (captured) {
      setImage(captured);
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {

        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setLat(latitude);
        setLon(longitude);

        const res = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );

        setLocationName(res.data.display_name);

      },
      () => {
        setLocationName("Location permission denied");
      }
    );

  }, []);

  // ✅ SUBMIT REPORT TO BACKEND
  const handleSubmit = async () => {
  try {
    const blob = await fetch(image).then(res => res.blob());
    const file = new File([blob], "photo.jpg", { type: "image/jpeg" });
    
    const formData = new FormData();
    formData.append("image", image); // image file
    formData.append("description", description);
    formData.append("lat", lat);
    formData.append("lng", lon);

    const response = await fetch("http://localhost:5000/api/report/create", {
      method: "POST",
      body: formData
    });

    const data = await response.json();
    console.log(data);

    alert("Report submitted successfully");

  } catch (error) {
    console.error(error);
    alert("Failed to submit report");
  }
};
  return (
    <div className="spot-container">

      {/* HEADER */}
      <div className="spot-header">
        <h3>📷 Spot Now</h3>

        <button
          className="close-btn"
          onClick={() => navigate("/home")}
        >
          ✕
        </button>
      </div>

      {/* IMAGE PREVIEW */}
      <div className="image-preview">

        {image && <img src={image} alt="captured" />}

        <button
          className="retake-btn"
          onClick={() => navigate("/camera")}
        >
          Retake
        </button>

      </div>

      {/* LOCATION */}
      <div className="location-card">

        <p className="label">LOCATION</p>

        <div className="location-box">

          <div className="loc-icon">📍</div>

          <div>
            <h4>{locationName}</h4>
            <p>Automatically fetched via GPS</p>
          </div>

          <span className="dot"></span>

        </div>

        {lat && (
          <iframe
            title="map"
            width="100%"
            height="140"
            style={{ borderRadius: "10px", marginTop: "10px" }}
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.01},${lat - 0.01},${lon + 0.01},${lat + 0.01}&layer=mapnik&marker=${lat},${lon}`}
          ></iframe>
        )}

      </div>

      {/* DESCRIPTION */}
      <div className="description-box">

        <p className="label">DESCRIPTION</p>

        <textarea
          placeholder="Tell us more about this spot..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

      </div>

      {/* BUTTONS */}
      <button className="submit-btn" onClick={handleSubmit}>
        ➤ Submit Spot
      </button>

      <button className="draft-btn">
        Save as Draft
      </button>

    </div>
  );
}

export default SpotForm;