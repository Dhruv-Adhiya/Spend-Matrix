import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Dashboard</h1>
        <p className="text-gray-500 text-sm mb-4">
          Welcome, <span className="font-medium text-indigo-600">{user?.full_name}</span>
        </p>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
