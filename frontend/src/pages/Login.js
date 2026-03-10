import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styles/Login.css";

function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "user"
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const loginUser = async (role) => {

    try {

      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { ...formData, role }
      );

      alert(res.data.message);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/Home");
      }

    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }

  };

  return (

    <div className="login-wrapper">

      <div className="login-card">

        <h3 className="top-title">Log In</h3>

        <h1>Welcome Back</h1>

        <p className="subtitle">
          Enter your details to access your account
        </p>

        <input
          type="text"
          name="email"
          placeholder="Username or Email"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          onChange={handleChange}
        />

        <div className="forgot">
          <Link to="#">Forgot Password?</Link>
        </div>

        <button
          className="login-btn"
          onClick={() => loginUser("user")}
        >
          Login as User
        </button>

        <button
          className="admin-btn"
          onClick={() => loginUser("admin")}
        >
          Login as Admin
        </button>

        <div className="divider">
          <span>Or continue with</span>
        </div>

        <div className="social-buttons">

          <button className="social-btn">Google</button>

          <button className="social-btn">Apple</button>

        </div>

        <p className="signup">
          Don't have an account?
          <Link to="/register"> Sign Up</Link>
        </p>

      </div>

    </div>

  );

}

export default Login;