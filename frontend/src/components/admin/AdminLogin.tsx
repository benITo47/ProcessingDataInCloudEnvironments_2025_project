import React, { useState, FormEvent } from 'react';

interface AdminLoginProps {
  onLogin: (password: string) => Promise<void>;
  error: string | null;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, error }) => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onLogin(password);
    setLoading(false);
  };

  return (
    <section className="add-section">
      <h2>Admin Access</h2>
      <form onSubmit={handleLogin} className="add-form">
        <div className="form-group">
          <label htmlFor="adminPassword">Password:</label>
          <input
            id="adminPassword"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoFocus
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="search-btn" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </section>
  );
};

export default AdminLogin;