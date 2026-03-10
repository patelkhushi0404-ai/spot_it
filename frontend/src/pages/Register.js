import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styles/Auth.css";

function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData
      );

      // popup message
      alert(res.data.message);

      // store token
      localStorage.setItem("token", res.data.token);

      // store user
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // redirect home
      navigate("/Home");

    } catch (error) {

      alert(error.response?.data?.message || "Registration failed");

    }

  };

  return (

    <div className="auth-wrapper">

      <div className="auth-card">

        <h2>Create Your Account</h2>
        <p className="auth-subtitle">Join our community</p>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            required
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            required
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            onChange={handleChange}
          />

          <button type="submit" className="auth-btn">
            Sign Up
          </button>

        </form>

        <p className="auth-switch">
          Already have an account?
          <Link to="/login"> Login</Link>
        </p>

      </div>

    </div>

  );

}

export default Register;