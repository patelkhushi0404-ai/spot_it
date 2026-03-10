import Navbar from "../components/Navbar";
import FlowSection from "../components/FlowSection";
import RecentQueries from "../components/RecentQueries";
import Rewards from "../pages/Rewards";
import About from "../pages/About";
import Footer from "../components/Footer";
import "../styles/Home.css";

function Home() {
  return (
    <div className="home">

      <Navbar />

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <span className="tag">Inspired by Swachh Bharat</span>

          <h1>
            SpotIt: Keep Our <span>Environment Clean</span>
          </h1>

          <p>
            Real-time AI detection for environmental issues.
            Report waste instantly and help build a cleaner India.
          </p>

          <div className="hero-buttons">
            <button className="primary-btn">Get Started Now</button>
            <button className="secondary-btn">Watch Video</button>
          </div>
        </div>
      </section>

      <FlowSection />

      <RecentQueries />

      <Rewards />

      <About />

      <Footer />

    </div>
  );
}

export default Home;