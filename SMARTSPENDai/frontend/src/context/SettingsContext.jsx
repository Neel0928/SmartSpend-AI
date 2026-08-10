import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSettings } from '../services/settingsService';
import { useAuth } from './AuthContext';

const SettingsContext = createContext();

export function useSettings() {
  return useContext(SettingsContext);
}

export const SettingsProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [settings, setSettings] = useState({
    currency: 'INR',
    theme: 'light',
    monthlyBudget: 0,
    notifications: true
  });
  const [loading, setLoading] = useState(true);

  // Map currency code to symbol
  const getCurrencySymbol = (currencyCode) => {
    switch (currencyCode) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'JPY': return '¥';
      case 'INR':
      default: return '₹';
    }
  };

  const currencySymbol = getCurrencySymbol(settings.currency);

  const fetchSettings = async () => {
    if (!currentUser) return;
    try {
      const data = await getSettings();
      setSettings(data);
    } catch (error) {
      console.error('Failed to load settings', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchSettings();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const value = {
    settings,
    setSettings,
    currencySymbol,
    refreshSettings: fetchSettings
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
