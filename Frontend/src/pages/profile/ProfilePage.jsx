import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../../components/ui/Icon';
import toast from 'react-hot-toast';
import { profileService } from '../../services/profileService';
import { useAuth } from '../../context/AuthContext';
import { GlassCard } from '../../components/ui/GlassCard';
import { GlassInput } from '../../components/ui/GlassInput';
import { GlassButton } from '../../components/ui/GlassButton';
import { Spinner } from '../../components/ui/Spinner';
import './ProfilePage.css';

export const ProfilePage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState({
    full_name: '',
    email: ''
  });
  
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await profileService.getProfile();
        const data = res.data?.data || res.data || res;
        setProfile({
          full_name: data.full_name || '',
          email: data.email || ''
        });
      } catch (err) {
        toast.error('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profile.full_name || !profile.email) {
      toast.error('Name and Email are required');
      return;
    }

    setIsSavingProfile(true);
    try {
      await profileService.updateProfile(profile);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwords.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsChangingPassword(true);
    try {
      await profileService.changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      toast.success('Password changed successfully');
      setPasswords({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  if (isLoading) {
    return (
      <div className="profile-page center">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div>
          <h1 className="page-title">Profile</h1>
          <p className="page-subtitle">Manage your personal information and security settings.</p>
        </div>
        <GlassButton icon="LogOut" variant="danger" onClick={handleLogout}>
          Logout
        </GlassButton>
      </div>

      <div className="profile-content-grid">
        {/* Left Column: Overview & Edit Profile */}
        <div className="profile-col">
          <GlassCard className="profile-overview-card" padding="large">
            <div className="avatar-circle">
              {getInitials(profile.full_name)}
            </div>
            <div className="profile-info">
              <h2 className="profile-name">{profile.full_name || 'User'}</h2>
              <p className="profile-email">{profile.email}</p>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="section-title">Edit Details</h3>
            <form onSubmit={handleProfileSubmit} className="profile-form">
              <div className="form-group">
                <GlassInput
                  label="Full Name"
                  name="full_name"
                  value={profile.full_name}
                  onChange={handleProfileChange}
                  icon={<Icon name="User" size={18} />}
                />
              </div>
              <div className="form-group">
                <GlassInput
                  label="Email Address"
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  icon={<Icon name="Mail" size={18} />}
                />
              </div>
              <div className="form-actions">
                <GlassButton type="submit" variant="primary" icon="Save" isLoading={isSavingProfile}>
                  Save Changes
                </GlassButton>
              </div>
            </form>
          </GlassCard>
        </div>

        {/* Right Column: Change Password */}
        <div className="profile-col">
          <GlassCard>
            <h3 className="section-title">Change Password</h3>
            <form onSubmit={handlePasswordSubmit} className="profile-form">
              <div className="form-group">
                <GlassInput
                  label="Current Password"
                  name="currentPassword"
                  type="password"
                  value={passwords.currentPassword}
                  onChange={handlePasswordChange}
                  icon={<Icon name="Lock" size={18} />}
                  required
                />
              </div>
              <div className="form-group">
                <GlassInput
                  label="New Password"
                  name="newPassword"
                  type="password"
                  value={passwords.newPassword}
                  onChange={handlePasswordChange}
                  icon={<Icon name="Lock" size={18} />}
                  required
                />
              </div>
              <div className="form-group">
                <GlassInput
                  label="Confirm New Password"
                  name="confirmPassword"
                  type="password"
                  value={passwords.confirmPassword}
                  onChange={handlePasswordChange}
                  icon={<Icon name="Lock" size={18} />}
                  required
                />
              </div>
              <div className="form-actions">
                <GlassButton type="submit" variant="primary" icon="Save" isLoading={isChangingPassword}>
                  Update Password
                </GlassButton>
              </div>
            </form>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
