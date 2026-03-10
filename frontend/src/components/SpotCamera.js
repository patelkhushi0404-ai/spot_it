import React from "react";
import "../styles/SpotCamera.css";
import { FaCamera, FaBolt, FaGlobe, FaLeaf } from "react-icons/fa";
import { BsCameraFill } from "react-icons/bs";
// import lensIcon from "../assets/spot-lens.png";
import { useNavigate } from "react-router-dom";
function Home() {
    const navigate = useNavigate();
  return (
    
    <div className="home">

      

      {/* HERO SECTION */}

      <section className="hero">

        <div className="feature left">
          <div className="icon blue">
            <BsCameraFill />
          </div>
          <h3>Neural Intelligence</h3>
          <p>
            Powered by state-of-the-art vision models for instant,
            pixel-perfect object recognition.
          </p>
        </div>

        <div className="center-circle" onClick={() => navigate("/camera")}>
          <div className="circle-inner">
            <div className="lens">
              {/* <img src={lensIcon} alt="Spot Lens" /> */}
            </div>
            <h2>SPOT NOW</h2>
          </div>
          <p className="circle-text">
            Tap the lens to experience the power of instant visual discovery.
          </p>
        </div>

        <div className="feature right">
          <div className="icon orange">
            <FaBolt />
          </div>
          <h3>Zero Latency</h3>
          <p>
            Proprietary edge processing delivers identification results
            in under 150 milliseconds.
          </p>
        </div>

      </section>

      {/* SECOND FEATURE ROW */}

      <section className="feature-row">

        <div className="feature">
          <div className="icon green">
            <FaLeaf />
          </div>
          <h3>Deep Context</h3>
          <p>
            Go beyond labels. Get history, pricing trends,
            and related insights in a single tap.
          </p>
        </div>

        <div className="feature">
          <div className="icon gray">
            <FaGlobe />
          </div>
          <h3>Global Database</h3>
          <p>
            Identifying over 2 billion objects from rare flora
            to modern retail across 190 countries.
          </p>
        </div>

      </section>

      {/* THREE STEPS */}

      <section className="steps">

        <h2>Three Steps to Discovery</h2>
        <p>Our seamless process turns curiosity into clarity.</p>

        <div className="steps-grid">

          <div className="step-card">
            <div className="step-icon blue">
              <FaCamera />
            </div>
            <h3>Point & Capture</h3>
            <p>
              Aim your device at any object. Our stabilization AI
              ensures a crisp scan every time.
            </p>
          </div>

          <div className="step-card">
            <div className="step-icon orange">
              📊
            </div>
            <h3>Instant Analysis</h3>
            <p>
              Cloud-native neural networks parse features,
              textures, and context in real-time.
            </p>
          </div>

          <div className="step-card">
            <div className="step-icon green">
              💡
            </div>
            <h3>Get Insights</h3>
            <p>
              Receive a rich profile including history,
              matching items, and direct actions.
            </p>
          </div>

        </div>
      </section>

      {/* FOOTER */}

      <footer className="footer">
        <h3>SPOT NOW</h3>
        <p>© 2024 Spot Now AI. Redefining visual discovery.</p>
      </footer>
       
    </div>
    
  );
}

export default Home;