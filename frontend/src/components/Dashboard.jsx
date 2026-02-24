import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiCreditCard, FiBarChart2, FiTrendingUp, FiShield, FiRefreshCcw } from 'react-icons/fi';
import { checkBalance } from '../services/api';
import BalanceDisplay from './BalanceDisplay';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showBalance, setShowBalance] = useState(false);

  const handleCheckBalance = async () => {
    setError('');
    setLoading(true);
    setShowBalance(false);

    try {
      const response = await checkBalance();
      setBalance(response.balance);
      setShowBalance(true);
    } catch (err) {
      if (err.response?.status === 401) {
        // Token expired or invalid, redirect to login
        navigate('/login');
      } else {
        setError(err.response?.data?.error || 'Failed to fetch balance. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear cookie by setting it to expire
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    navigate('/login');
  };

  return (
    <div className="dashboard-shell">
      <header className="top-nav glass-panel">
        <div className="nav-left">
          <div className="nav-logo">
            <span className="nav-logo-icon">₭</span>
            <div className="nav-logo-text">
              <span className="nav-brand">Kodbank</span>
              <span className="nav-tagline">Digital Banking</span>
            </div>
          </div>
        </div>
        <div className="nav-right">
          <div className="nav-chip">
            <FiShield className="nav-chip-icon" />
            <span>Secure Session</span>
          </div>
          <button className="nav-logout" onClick={handleLogout}>
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <section className="dashboard-primary glass-panel">
          <div className="dashboard-header">
            <div>
              <h1>Welcome back</h1>
              <p className="welcome-text">
                Check your balance, review insights, and stay on top of your money.
              </p>
            </div>
            <button
              onClick={handleCheckBalance}
              className="balance-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <FiRefreshCcw className="btn-icon spinning" />
                  Checking...
                </>
              ) : (
                <>
                  <FiBarChart2 className="btn-icon" />
                  Check balance
                </>
              )}
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          {showBalance && balance !== null && (
            <BalanceDisplay balance={balance} />
          )}
        </section>

        <section className="dashboard-grid">
          <div className="info-card glass-panel highlight-card">
            <div className="info-card-header">
              <div className="info-card-icon primary">
                <FiCreditCard />
              </div>
              <div>
                <h3>Primary account</h3>
                <p>Everyday spending & salary</p>
              </div>
            </div>
            <div className="card-number">
              <span className="label">Account</span>
              <span className="value">**** 2345  •  Kod Savings</span>
            </div>
            <div className="card-footer">
              <span>Instant transfers</span>
              <span>Virtual & physical card</span>
            </div>
          </div>

          <div className="info-card glass-panel compact-card">
            <div className="info-card-header">
              <div className="info-card-icon">
                <FiTrendingUp />
              </div>
              <div>
                <h3>Insights snapshot</h3>
                <p>This month’s overview</p>
              </div>
            </div>
            <div className="insights-row">
              <div className="insight-pill">
                <span className="label">Spend</span>
                <span className="value">- ₹18,400</span>
              </div>
              <div className="insight-pill positive">
                <span className="label">Income</span>
                <span className="value">+ ₹25,000</span>
              </div>
            </div>
            <p className="insight-caption">
              Tip: Keep at least 20% of your income in savings to hit your goals faster.
            </p>
          </div>

          <div className="info-card glass-panel compact-card">
            <div className="info-card-header">
              <div className="info-card-icon">
                <FiBarChart2 />
              </div>
              <div>
                <h3>Shortcuts</h3>
                <p>One‑tap quick actions</p>
              </div>
            </div>
            <div className="shortcuts-row">
              <button className="shortcut-pill" type="button">
                Scheduled payments
              </button>
              <button className="shortcut-pill" type="button">
                Statements
              </button>
              <button className="shortcut-pill" type="button">
                Manage limits
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
