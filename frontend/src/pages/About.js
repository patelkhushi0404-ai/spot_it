import "../styles/About.css";

function About() {
  return (
    <section className="about">

      <h2>Vision & Technology</h2>

      <div className="about-container">

        <div className="about-box">
          <h3>Our Vision</h3>
          <p>
            To empower every citizen to actively protect the environment.
            Inspired by the Swachh Bharat mission, SpotIt bridges the gap
            between communities and local authorities to build cleaner cities.
          </p>
        </div>

        <div className="about-box">
          <h3>AI Technology</h3>
          <p>
            Our platform uses AI and computer vision to detect environmental
            waste from uploaded images and automatically categorize issues
            for faster resolution.
          </p>
        </div>

      </div>

      <div className="stats">

        <div className="stat">
          <h3>2.5M+</h3>
          <p>Tons of Waste Cleared</p>
        </div>

        <div className="stat">
          <h3>500+</h3>
          <p>Cities Covered</p>
        </div>

        <div className="stat">
          <h3>1.2M</h3>
          <p>Active Spotters</p>
        </div>

      </div>

    </section>
  );
}

export default About;