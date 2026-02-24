import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogIn, FiShield } from 'react-icons/fi';
import { loginUser } from '../services/api';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
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
      await loginUser(formData);
      // Redirect to dashboard on success
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-hero">
        <div className="login-hero-content">
          <div className="brand-badge">
            <div className="brand-icon">
              <FiShield />
            </div>
            <span>Kodbank</span>
          </div>
          <h1 className="hero-title">Welcome back to your smart bank.</h1>
          <p className="hero-subtitle">
            Sign in to manage your accounts, monitor balances, and experience a clean,
            modern banking dashboard built for you.
          </p>
        </div>
      </div>

      <div className="login-container">
        <div className="login-card glass-panel">
          <div className="card-header">
            <div className="card-icon">
              <FiLogIn />
            </div>
            <div>
              <h2>Sign in</h2>
              <p className="subtitle">Access your Kodbank account</p>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Enter your username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Verifying...' : 'Login securely'}
          </button>
        </form>

        <p className="register-link">
          New to Kodbank? <a href="/register">Open an account</a>
        </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
