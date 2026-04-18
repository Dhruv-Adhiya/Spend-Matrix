import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from '../components/NotificationBell';
import {
  LayoutDashboard, CreditCard, Tag, Target, BarChart2,
  RefreshCw, Settings, LogOut, Shield, X, Menu,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
  { to: '/transactions', label: 'Transactions', icon: CreditCard },
  { to: '/categories',   label: 'Categories',   icon: Tag },
  { to: '/budgets',      label: 'Budgets',       icon: Target },
  { to: '/analytics',   label: 'Analytics',    icon: BarChart2 },
  { to: '/recurring',   label: 'Recurring',    icon: RefreshCw },
];

const getInitials = (name) => {
  const parts = name?.split(' ') || [];
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase();
};

function Sidebar({ user, onClose }) {
  return (
    <aside
      style={{
        width: 220,
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(16px)',
        borderRight: '1.5px solid rgba(229,231,235,0.8)',
        boxShadow: '4px 0 20px rgba(0,0,0,0.03)',
        height: 'calc(100vh - 64px)',
        position: 'sticky',
        top: 64,
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 12px',
        gap: 4,
        overflowY: 'auto',
        flexShrink: 0,
      }}
    >
      {/* Close button — mobile only */}
      {onClose && (
        <button
          onClick={onClose}
          style={{ alignSelf: 'flex-end', marginBottom: 8 }}
          className="btn-icon"
          aria-label="Close menu"
        >
          <X size={16} />
        </button>
      )}

      {/* Section label */}
      <p style={{ fontSize: '0.625rem', fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0 12px', marginBottom: 8 }}>
        Main Menu
      </p>

      {/* Nav items */}
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onClose}
          className={({ isActive }) =>
            `flex items-center gap-2.5 rounded-[10px] text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-gradient-to-r from-indigo-100/80 to-violet-100/50 text-indigo-600 font-semibold'
                : 'text-gray-500 hover:bg-indigo-50/60 hover:text-indigo-600'
            }`
          }
          style={({ isActive }) => ({
            padding: isActive ? '10px 14px 10px 11px' : '10px 14px',
            borderLeft: isActive ? '3px solid #4F46E5' : '3px solid transparent',
          })}
        >
          {({ isActive }) => (
            <>
              <Icon size={18} color={isActive ? '#4F46E5' : '#6B7280'} />
              {label}
            </>
          )}
        </NavLink>
      ))}

      {/* Admin section */}
      {user?.role === 'admin' && (
        <>
          <hr style={{ border: 'none', borderTop: '1px solid #E5E7EB', margin: '8px 12px' }} />
          <p style={{ fontSize: '0.625rem', fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0 12px', marginBottom: 8 }}>
            Admin
          </p>
          <NavLink
            to="/admin"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-[10px] text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-violet-100/60 text-violet-700 font-semibold'
                  : 'text-gray-500 hover:bg-violet-50 hover:text-violet-700'
              }`
            }
            style={({ isActive }) => ({
              padding: isActive ? '10px 14px 10px 11px' : '10px 14px',
              borderLeft: isActive ? '3px solid #7C3AED' : '3px solid transparent',
            })}
          >
            {({ isActive }) => (
              <>
                <Shield size={18} color={isActive ? '#7C3AED' : '#6B7280'} />
                Admin Panel
              </>
            )}
          </NavLink>
        </>
      )}

      {/* Pro Tip card */}
      <div style={{ marginTop: 'auto', margin: 'auto 4px 4px' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
            borderRadius: 12,
            padding: 14,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <p style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 600, fontSize: '0.75rem', color: '#fff' }}>💡 Pro Tip</p>
          <p style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 400, fontSize: '0.6875rem', color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>
            Set budgets to track your spending goals!
          </p>
        </div>
      </div>
    </aside>
  );
}

export default function MainLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F8FAFF' }}>

      {/* ── Header ── */}
      <header
        style={{
          height: 64,
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1.5px solid rgba(229,231,235,0.8)',
          boxShadow: '0 2px 20px rgba(0,0,0,0.04)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          padding: '0 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Left — hamburger (mobile) + logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            className="btn-icon md:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
            style={{ display: 'none' }}
          >
            <Menu size={20} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{ fontSize: 24, display: 'inline-block', transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1)', cursor: 'default' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'rotate(12deg) scale(1.1)'}
              onMouseLeave={e => e.currentTarget.style.transform = ''}
            >💰</span>
            <span className="gradient-text" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 700, fontSize: '1.25rem' }}>
              Spend Matrix
            </span>
          </div>
        </div>

        {/* Right — controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <NotificationBell />

          {/* Settings gear */}
          <NavLink
            to="/settings"
            aria-label="Settings"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: '50%', transition: 'all 0.18s ease', color: '#6B7280' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(79,70,229,0.08)'; e.currentTarget.style.color = '#4F46E5'; }}
            onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = '#6B7280'; }}
          >
            <Settings size={22} />
          </NavLink>

          {/* User avatar */}
          <div
            style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg, #4F46E5, #8B5CF6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: '"DM Sans", sans-serif', fontWeight: 600, fontSize: 14, color: '#fff',
              flexShrink: 0,
            }}
          >
            {getInitials(user?.full_name)}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            style={{
              height: 32, padding: '0 12px',
              background: 'rgba(239,68,68,0.1)',
              color: '#DC2626',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 8,
              fontFamily: '"DM Sans", sans-serif', fontWeight: 500, fontSize: 13,
              cursor: 'pointer', transition: 'all 0.2s ease',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#EF4444'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#DC2626'; }}
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>

      {/* ── Body ── */}
      <div style={{ display: 'flex', flex: 1 }}>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 99 }}
          />
        )}

        {/* Mobile sidebar drawer */}
        {sidebarOpen && (
          <div style={{ position: 'fixed', left: 0, top: 0, height: '100vh', zIndex: 100 }}>
            <Sidebar user={user} onClose={() => setSidebarOpen(false)} />
          </div>
        )}

        {/* Desktop sidebar */}
        <div className="hidden md:block" style={{ display: 'block' }}>
          <Sidebar user={user} />
        </div>

        {/* Main content */}
        <main
          style={{
            flex: 1,
            padding: '28px 32px',
            background: '#F8FAFF',
            minHeight: 'calc(100vh - 64px)',
            overflowY: 'auto',
            backgroundImage: 'radial-gradient(circle, rgba(79,70,229,0.06) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        >
          <div className="page-enter">{children}</div>
        </main>
      </div>
    </div>
  );
}
