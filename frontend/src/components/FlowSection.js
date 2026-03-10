import "../components/Flow.css";

import {
  FaSearch,
  FaCamera,
  FaRobot,
  FaEdit,
  FaCheckCircle,
  FaTasks,
  FaBroom,
  FaGift
} from "react-icons/fa";

function FlowSection() {

  const steps = [
    {
      title: "Spot Now",
      icon: <FaSearch />,
      desc: "User spots garbage or an environmental issue and taps Spot Now to report it."
    },
    {
      title: "Capture",
      icon: <FaCamera />,
      desc: "User captures a photo of the waste using their device camera."
    },
    {
      title: "Detect",
      icon: <FaRobot />,
      desc: "AI analyzes the image and detects the type of waste."
    },
    {
      title: "Describe",
      icon: <FaEdit />,
      desc: "User adds additional details and confirms the location."
    },
    {
      title: "Review",
      icon: <FaCheckCircle />,
      desc: "The system verifies the report for accuracy."
    },
    {
      title: "Assign",
      icon: <FaTasks />,
      desc: "Issue is assigned to the nearest cleaning authority."
    },
    {
      title: "Clean",
      icon: <FaBroom />,
      desc: "Cleaning team resolves the issue and clears the waste."
    },
    {
      title: "Reward",
      icon: <FaGift />,
      desc: "User earns eco-points for helping keep the environment clean."
    }
  ];

  return (
    <section className="flow">

      <h2>The Flow</h2>

      <p className="flow-sub">
        Our AI powered platform makes reporting environmental issues simple.
      </p>

      <div className="flow-grid">

        {steps.map((step, index) => (
          <div className="flow-card" key={index}>

            <div className="flow-icon">
              {step.icon}
            </div>

            <h3>{index + 1}. {step.title}</h3>

            <p>{step.desc}</p>

          </div>
        ))}

      </div>

    </section>
  );
}

export default FlowSection;