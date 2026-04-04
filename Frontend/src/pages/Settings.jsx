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
      <h1 className="text-xl font-bold text-gray-800 mb-6">Settings</h1>

      {loading && (
        <div className="flex items-center justify-center h-48 text-gray-400 text-sm">Loading...</div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3">{error}</div>
      )}

      {!loading && !error && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <SettingsTabs active={activeTab} onChange={setActiveTab} />
          {activeTab === 'Profile' && <ProfileForm initialData={profile} />}
          {activeTab === 'Password' && <PasswordForm />}
          {activeTab === 'Preferences' && <PreferencesForm initialData={preferences} />}
        </div>
      )}
    </MainLayout>
  );
}
