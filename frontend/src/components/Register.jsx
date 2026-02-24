import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiShield, FiUserPlus } from 'react-icons/fi';
import { registerUser } from '../services/api';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    uid: '',
    username: '',
    password: '',
    email: '',
    phone: '',
    role: 'Customer'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await registerUser(formData);
      // Redirect to login page on success
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-hero">
        <div className="register-hero-content">
          <div className="brand-badge">
            <div className="brand-icon">
              <FiShield />
            </div>
            <span>Kodbank</span>
          </div>
          <h1 className="hero-title">Banking for the modern era.</h1>
          <p className="hero-subtitle">
            Open a secure digital account in minutes, track your balance in real time,
            and enjoy a delightful experience every time you log in.
          </p>
          <div className="hero-stats">
            <div className="stat-card">
              <span className="stat-label">Security</span>
              <span className="stat-value">256-bit</span>
              <span className="stat-caption">Bank‑grade encryption</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Uptime</span>
              <span className="stat-value">99.99%</span>
              <span className="stat-caption">Always available</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Support</span>
              <span className="stat-value">24/7</span>
              <span className="stat-caption">We’ve got your back</span>
            </div>
          </div>
        </div>
      </div>

      <div className="register-container">
        <div className="register-card glass-panel">
          <div className="card-header">
            <div className="card-icon">
              <FiUserPlus />
            </div>
            <div>
              <h2>Create Account</h2>
              <p className="subtitle">Join Kodbank today</p>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="uid">User ID</label>
            <input
              type="text"
              id="uid"
              name="uid"
              value={formData.uid}
              onChange={handleChange}
              placeholder="Enter User ID"
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username *</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Enter username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter password"
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <input
              type="text"
              id="role"
              name="role"
              value={formData.role}
              disabled
              className="disabled-input"
            />
            <small>Only Customer role is available</small>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Creating your account...' : 'Create account'}
          </button>
        </form>

        <p className="login-link">
          Already with Kodbank? <a href="/login">Login to your account</a>
        </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
