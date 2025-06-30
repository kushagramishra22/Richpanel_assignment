// components/AuthForm.js
import React, { useState } from "react";
import "./AuthForm.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthForm = ({ isLogin }) => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `http://localhost:5000/api/${isLogin ? "login" : "register"}`;
      const payload = isLogin
        ? { email: form.email, password: form.password }
        : form;

      const res = await axios.post(url, payload);
      if (isLogin) {
        localStorage.setItem("token", res.data.token);
        navigate("/connect");
      } else {
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Something went wrong");
    }
  };

  return (
    <div className="auth-page-wrapper">
    <div className="auth-container">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGMlHvOWVKfzAb8wOGqV6Z6YwaElHNI3Xo3w&s" alt="App Logo" className="auth-logo" />
      <h2>{isLogin ? "Login to your account" : "Create Account"}</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">{isLogin ? "Login" : "Register"}</button>
      </form>
    </div>
    </div>
  );
};

export default AuthForm;
