import "./../styles/Rewards.css";

function Rewards() {
  return (
    <section className="rewards">

      <div className="reward-left">
        <div className="reward-card">
          <h3>REWARDS</h3>
          <p>Minimal Safe Network</p>
        </div>
      </div>

      <div className="reward-right">

        <h2>
          Earn Rewards for Every <span>Clean Spot</span>
        </h2>

        <p>
          Join our gamified mission. Earn Eco-Points for reporting
          waste and redeem them for vouchers and rewards.
        </p>

        <ul>
          <li>🏅 Earn badges</li>
          <li>🎁 Redeem vouchers</li>
          <li>🏆 Climb leaderboard</li>
        </ul>

        <button className="reward-btn">
          Explore Rewards Catalog
        </button>

      </div>

    </section>
  );
}

export default Rewards;