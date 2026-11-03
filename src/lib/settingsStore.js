import { useState, useEffect } from 'react';
import { supabase } from './supabase';

export const DEFAULT_SITE_SETTINGS = {
  // 📢 Header Offer / Announcement Bar
  showAnnouncement: true,
  announcementBadge: 'OFFER 2026',
  announcementText: '⚡ 2D Vaastu Floor Plans @ ₹999 & 3D Photorealistic Facades @ ₹2499 • 24hr Turnaround!',
  announcementSubText: '24/7 Architect Support • 100% Vaastu Verified',

  // 🏛️ Studio Branding & Slogan
  brandName: 'e-Naksha',
  siteSlogan: 'Sketch Your Dream',
  brandTagline: 'Professional 2D Vaastu Blueprints & 3D Elevations',

  // 📞 Support & Contacts
  contactPhone: '+91 98765 43210',
  contactEmail: 'support@enaksha.com',
  workingHours: '24/7 Architect Consultation Available',

  // 🔍 SEO Metadata
  metaTitle: 'e-Naksha | Sketch Your Dream - 2D Vaastu Floor Plans & 3D Elevations',
  metaDescription: 'Order government-compliant 2D architectural floor plans and photorealistic 3D elevations. Vaastu optimized blueprints in 24-48 hours.',
  keywords: 'architectural blueprints, 2d floor plan, 3d elevation, vaastu house plan, CAD drawing, architectural layout',
  canonicalUrl: 'https://enaksha.com',
};

const LOCAL_STORAGE_KEY = 'enaksha_site_settings_v1';

// In-memory subscribers for immediate multi-component re-renders
const listeners = new Set();

let currentSettings = (() => {
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      return { ...DEFAULT_SITE_SETTINGS, ...JSON.parse(cached) };
    }
  } catch (e) {
    console.warn('Failed to parse cached settings:', e);
  }
  return { ...DEFAULT_SITE_SETTINGS };
})();

export const getSiteSettings = () => currentSettings;

export const updateSiteSettings = async (newSettings) => {
  currentSettings = { ...currentSettings, ...newSettings };
  
  // 1. Save to local storage for zero-latency persistence
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentSettings));
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
  }

  // 2. Notify all active React subscribers
  listeners.forEach((listener) => {
    try {
      listener(currentSettings);
    } catch (err) {
      console.warn('Listener error:', err);
    }
  });

  // 3. Sync to Supabase table if available
  try {
    const { error } = await supabase
      .from('site_settings')
      .upsert({ id: 'primary', data: currentSettings, updated_at: new Date().toISOString() });
    if (error) {
      console.info('Supabase site_settings table notice (using local storage backup):', error.message);
    }
  } catch (err) {
    console.info('Supabase sync skipped, local storage retained:', err);
  }

  return currentSettings;
};

// React hook for consuming and reacting to site settings
export const useSiteSettings = () => {
  const [settings, setSettings] = useState(currentSettings);

  useEffect(() => {
    // Initial fetch from Supabase in background
    const fetchRemoteSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('data')
          .eq('id', 'primary')
          .single();
        
        if (data && data.data && !error) {
          const merged = { ...DEFAULT_SITE_SETTINGS, ...data.data };
          currentSettings = merged;
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
          setSettings(merged);
        }
      } catch (err) {
        // Fall back quietly to local storage
      }
    };

    fetchRemoteSettings();

    const handleUpdate = (updated) => setSettings(updated);
    listeners.add(handleUpdate);
    return () => listeners.delete(handleUpdate);
  }, []);

  return { settings, updateSettings: updateSiteSettings, defaultSettings: DEFAULT_SITE_SETTINGS };
};
