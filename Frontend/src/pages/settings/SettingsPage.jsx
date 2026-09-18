import { useState, useEffect } from 'react';
// Removed lucide-react
import toast from 'react-hot-toast';
import { settingsService } from '../../services/settingsService';
import { useTheme } from '../../context/ThemeContext';
import { GlassCard } from '../../components/ui/GlassCard';
import { GlassButton } from '../../components/ui/GlassButton';
import { GlassSelect } from '../../components/ui/GlassSelect';
import { GlassInput } from '../../components/ui/GlassInput';
import { Spinner } from '../../components/ui/Spinner';
import './SettingsPage.css';

export const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  
  const [formData, setFormData] = useState({
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    date_format: 'YYYY-MM-DD',
    notification_enabled: true,
    budget_alert_threshold: 80
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await settingsService.getSettings();
        const settings = res.data || res;
        
        // Merge fetched settings with existing local state (if backend returns null/empty for some)
        setFormData(prev => ({
          ...prev,
          ...settings
        }));
      } catch (err) {
        toast.error('Failed to load settings');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // For boolean select mimicking a checkbox, handle explicitly if needed
    // Assuming we use standard select for boolean
    let parsedValue = value;
    if (name === 'notification_enabled') {
      parsedValue = value === 'true';
    } else if (name === 'budget_alert_threshold') {
      parsedValue = Number(value);
    }
    
    setFormData(prev => ({ ...prev, [name]: parsedValue }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await settingsService.updateSettings(formData);
      toast.success('Settings saved successfully');
    } catch (err) {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="settings-page center">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div className="settings-page">
      <div className="settings-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your account preferences and application behavior.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="settings-form">
        <div className="settings-sections-grid">
          
          {/* Appearance */}
          <GlassCard className="settings-section">
            <h3 className="section-title">Appearance</h3>
            <p className="section-desc">Customize how SpendMatrix looks on your device.</p>
            <div className="form-group">
              <GlassSelect
                label="Theme"
                name="theme"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                options={[
                  { value: 'dark', label: 'Dark (Glassmorphism)' },
                  { value: 'light', label: 'Light' }
                ]}
              />
              <span className="help-text">Theme changes apply instantly across the app.</span>
            </div>
          </GlassCard>

          {/* Currency */}
          <GlassCard className="settings-section">
            <h3 className="section-title">Currency & Formatting</h3>
            <p className="section-desc">Set your local currency and how numbers should be displayed.</p>
            <div className="form-group">
              <GlassSelect
                label="Primary Currency"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                options={[
                  { value: 'INR', label: 'Indian Rupee (₹)' },
                  { value: 'USD', label: 'US Dollar ($)' },
                  { value: 'EUR', label: 'Euro (€)' },
                  { value: 'GBP', label: 'British Pound (£)' }
                ]}
              />
            </div>
          </GlassCard>

          {/* Date & Time */}
          <GlassCard className="settings-section">
            <h3 className="section-title">Date & Time</h3>
            <p className="section-desc">Configure timezones and how dates are formatted.</p>
            <div className="form-group split">
              <GlassSelect
                label="Timezone"
                name="timezone"
                value={formData.timezone}
                onChange={handleChange}
                options={[
                  { value: 'Asia/Kolkata', label: 'Asia/Kolkata (IST)' },
                  { value: 'America/New_York', label: 'America/New_York (EST)' },
                  { value: 'Europe/London', label: 'Europe/London (GMT)' },
                  { value: 'UTC', label: 'UTC' }
                ]}
              />
              <GlassSelect
                label="Date Format"
                name="date_format"
                value={formData.date_format}
                onChange={handleChange}
                options={[
                  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (e.g., 2023-10-15)' },
                  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (e.g., 15/10/2023)' },
                  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (e.g., 10/15/2023)' }
                ]}
              />
            </div>
          </GlassCard>

          {/* Notifications & Alerts */}
          <GlassCard className="settings-section">
            <h3 className="section-title">Notifications & Alerts</h3>
            <p className="section-desc">Manage system alerts and budget warnings.</p>
            <div className="form-group">
              <GlassSelect
                label="Enable Notifications"
                name="notification_enabled"
                value={formData.notification_enabled.toString()}
                onChange={handleChange}
                options={[
                  { value: 'true', label: 'Enabled' },
                  { value: 'false', label: 'Disabled' }
                ]}
              />
            </div>
            <div className="form-group">
              <GlassInput
                label="Budget Alert Threshold (%)"
                name="budget_alert_threshold"
                type="number"
                min="1"
                max="100"
                value={formData.budget_alert_threshold}
                onChange={handleChange}
              />
              <span className="help-text">Receive an alert when you hit this percentage of your budget.</span>
            </div>
          </GlassCard>

        </div>

        <div className="settings-actions">
          <GlassButton type="submit" variant="primary" icon={Save} isLoading={isSaving}>
            Save Settings
          </GlassButton>
        </div>
      </form>
    </div>
  );
};
