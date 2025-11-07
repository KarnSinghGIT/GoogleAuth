import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useUser();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  // Get the first letter of the username or email
  const getUserInitial = () => {
    if (user?.name) return user.name.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return 'U'; // Default initial
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Dashboard</h1>
          <div className="user-avatar">
            {getUserInitial()}
          </div>
        </div>
        <div className="header-right">
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </header>
      
      <main className="dashboard-content">
        <section className="welcome-section">
          <h2>Welcome back!</h2>
          <p>You're now logged in to your dashboard.</p>
        </section>

        <section className="stats-section">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Users</h3>
              <p className="stat-number">1,234</p>
            </div>
            <div className="stat-card">
              <h3>Active Projects</h3>
              <p className="stat-number">12</p>
            </div>
            <div className="stat-card">
              <h3>Tasks Completed</h3>
              <p className="stat-number">89</p>
            </div>
            <div className="stat-card">
              <h3>Upcoming Events</h3>
              <p className="stat-number">5</p>
            </div>
          </div>
        </section>

        <section className="activity-section">
          <h3>Recent Activity</h3>
          <ul className="activity-list">
            <li>• You logged in</li>
            <li>• Profile updated successfully</li>
            <li>• New project created: Dashboard UI</li>
          </ul>
        </section>
      </main>

      <footer className="dashboard-footer">
        <p> 2025 Your App Name. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Dashboard;