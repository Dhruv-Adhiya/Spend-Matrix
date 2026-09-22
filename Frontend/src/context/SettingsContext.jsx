import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { settingsService } from '../services/settingsService';
import { useAuth } from './AuthContext';

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [settings, setSettings] = useState({
    currency: 'USD',
    timezone: 'UTC',
    date_format: 'YYYY-MM-DD',
    notification_enabled: true,
    budget_alert_threshold: 80
  });

  const refreshSettings = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await settingsService.getSettings();
      const fetchedSettings = res.data || res;
      setSettings(prev => ({ ...prev, ...fetchedSettings }));
    } catch (error) {
      console.error('Failed to fetch user settings:', error);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshSettings();
    }
  }, [isAuthenticated, refreshSettings]);

  // Dynamic currency formatter
  const formatCurrency = useCallback((amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: settings.currency || 'USD',
    }).format(amount || 0);
  }, [settings.currency]);

  const value = {
    settings,
    refreshSettings,
    formatCurrency
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

SettingsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
