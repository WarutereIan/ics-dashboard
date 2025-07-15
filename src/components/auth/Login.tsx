import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockUsers } from '@/lib/mockData';
import { User } from '@/types/dashboard';
import { useDashboard } from '@/contexts/DashboardContext';

interface LoginProps {}

export const Login: React.FC<LoginProps> = () => {
  const [selectedEmail, setSelectedEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useDashboard();

  // Simulate login by finding the user
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = mockUsers.find(u => u.email === selectedEmail);
    if (!user) {
      setError('Please select a valid user.');
      return;
    }
    localStorage.setItem('ics-dashboard-user', JSON.stringify(user));
    setUser(user);
    setError('');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-6 flex flex-col items-center"
      >
        <img src="/logo.png" alt="ICS Logo" className="h-10 w-16 mx-auto mb-2" />
        <h2 className="text-2xl font-bold text-center">IDMS Dashboard Login</h2>
        <div className="w-full">
          <label htmlFor="user" className="block text-sm font-medium mb-2">
            Select User
          </label>
          <select
            id="user"
            value={selectedEmail}
            onChange={e => setSelectedEmail(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">-- Choose a user --</option>
            {mockUsers.map(user => (
              <option key={user.id} value={user.email}>
                {user.name} ({user.role})
              </option>
            ))}
          </select>
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login; 