import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../components/SpotSuccess.css";

function SpotSuccess() {

  const navigate = useNavigate();
  const location = useLocation();

  // image from camera page
  const image = location.state?.image;

  return (
    <div className="success-page">

      <div className="success-card">

        {/* SUCCESS ICON */}

        <div className="success-icon">
          ✔
        </div>

        <h1>Spot Submitted Successfully!</h1>

        <p className="success-text">
          Thank you for contributing. Your report is now live and helping the community.
        </p>

        <hr />

        {/* REPORT PREVIEW */}

        <p className="section-title">REPORT PREVIEW</p>

        <div className="preview-card">

          <img
            src={image}
            alt="preview"
          />

          <div className="preview-info">

            <h3>The Urban Roastery</h3>

            <p className="location">
              📍 124 Design District, Downtown
            </p>

            <div className="tags">
              <span>Fast WiFi</span>
              <span>Outlets</span>
              <span>Quiet</span>
            </div>

            <p className="submitted">
              Submitted just now
            </p>

          </div>

        </div>

        {/* POINTS BOX */}

        <div className="points-box">

          ⭐ You earned <b>50 contribution points!</b>

          <p>
            Keep spotting great locations to unlock badges
            and influence the leaderboard.
          </p>

        </div>

        {/* BUTTONS */}

        <div className="btn-row">

          <button
            className="home-btn"
            onClick={() => navigate("/")}
          >
            🏠 Back to Home
          </button>

          <button
            className="another-btn"
            onClick={() => navigate("/camera")}
          >
            📍 Submit Another
          </button>

        </div>

        {/* SHARE */}

        <div className="share">

          <p>Share your new spot:</p>

          <div className="share-icons">
            <span>📘</span>
            <span>🔗</span>
            <span>📤</span>
          </div>

        </div>

      </div>

    </div>
  );
}

export default SpotSuccess;