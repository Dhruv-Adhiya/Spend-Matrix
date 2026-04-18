import { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import SettingsTabs from '../components/SettingsTabs';
import ProfileForm from '../components/ProfileForm';
import PasswordForm from '../components/PasswordForm';
import PreferencesForm from '../components/PreferencesForm';
import { settingsAPI } from '../services/settingsService';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('Profile');
  const [profile, setProfile] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([settingsAPI.getProfile(), settingsAPI.getPreferences()])
      .then(([profileRes, prefRes]) => {
        setProfile(profileRes.data);
        setPreferences(prefRes.data.data);
      })
      .catch((err) => {
        if (err.response?.status !== 401)
          setError(err.response?.data?.message || 'Failed to load settings.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <MainLayout>
      <div className="page-enter">
      <h1 className="gradient-text" style={{ fontFamily: '"Plus Jakarta Sans",sans-serif', fontWeight: 700, fontSize: '1.5rem', marginBottom: 20 }}>Settings</h1>

      {loading && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 192 }}><span className="spinner" /></div>}
      {error && <div style={{ background: 'rgba(239,68,68,0.07)', border: '1.5px solid rgba(239,68,68,0.25)', borderLeft: '3px solid #EF4444', borderRadius: 10, padding: '12px 16px', color: '#DC2626', fontFamily: '"DM Sans",sans-serif', fontSize: '0.875rem' }}>{error}</div>}

      {!loading && !error && (
        <div className="card" style={{ padding: 0, borderRadius: 16, overflow: 'hidden' }}>
          {/* Tab bar */}
          <div style={{ display: 'flex', borderBottom: '2px solid #E5E7EB', padding: '0 24px', gap: 0 }}>
            {['Profile','Password','Preferences'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{ padding: '14px 20px', fontFamily: '"DM Sans",sans-serif', fontWeight: activeTab === tab ? 600 : 500, fontSize: '0.9375rem', cursor: 'pointer', border: 'none', background: 'transparent', color: activeTab === tab ? '#4F46E5' : '#6B7280', position: 'relative', transition: 'color 0.15s' }}
                onMouseEnter={e => { if (activeTab !== tab) e.currentTarget.style.color = '#4F46E5'; }}
                onMouseLeave={e => { if (activeTab !== tab) e.currentTarget.style.color = '#6B7280'; }}
              >
                {tab}
                {activeTab === tab && <span style={{ position: 'absolute', bottom: -2, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg,#4F46E5,#8B5CF6)', borderRadius: '3px 3px 0 0' }} />}
              </button>
            ))}
          </div>
          {/* Tab content */}
          <div style={{ padding: '28px 24px', animation: 'fadeInUp 0.25s ease both' }}>
            {activeTab === 'Profile' && <ProfileForm initialData={profile} />}
            {activeTab === 'Password' && <PasswordForm />}
            {activeTab === 'Preferences' && <PreferencesForm initialData={preferences} />}
          </div>
        </div>
      )}
      </div>
    </MainLayout>
  );
}
