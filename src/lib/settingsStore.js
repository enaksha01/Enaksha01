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
  brandTagline: 'Professional 2D Vaastu Blueprints & 3D Elevations Studio',

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

const LOCAL_STORAGE_KEY = 'enaksha_site_settings_v2';

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

// 🌐 Universal Multi-Device Cloud Sync via Supabase
export const updateSiteSettings = async (newSettings) => {
  currentSettings = { ...currentSettings, ...newSettings };
  
  // 1. Save to local storage for immediate zero-latency feedback on current device
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentSettings));
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
  }

  // 2. Notify all active React subscribers on current tab
  listeners.forEach((listener) => {
    try {
      listener(currentSettings);
    } catch (err) {
      console.warn('Listener error:', err);
    }
  });

  // 3. Persist universally in Supabase (ecore_home_cms) so all devices receive changes
  const serialized = JSON.stringify(currentSettings);
  try {
    const { data: existing, error: checkError } = await supabase
      .from('ecore_home_cms')
      .select('id')
      .eq('section_type', 'site_settings');

    if (!checkError && existing && existing.length > 0) {
      const { error: updateError } = await supabase
        .from('ecore_home_cms')
        .update({
          subtitle: serialized,
          page_path: 'settings'
        })
        .eq('id', existing[0].id);

      if (updateError) {
        console.error('Supabase settings update error:', updateError);
        throw updateError;
      }
    } else {
      const { error: insertError } = await supabase
        .from('ecore_home_cms')
        .insert([{
          section_type: 'site_settings',
          title: 'site_config_v1',
          subtitle: serialized,
          page_path: 'settings',
          icon_class: '',
          category_tag: '',
          image_url: '',
          location: ''
        }]);

      if (insertError) {
        console.error('Supabase settings insert error:', insertError);
        throw insertError;
      }
    }
  } catch (err) {
    console.error('Critical: Failed to sync site settings to Supabase cloud:', err);
    throw err;
  }

  return currentSettings;
};

// Module-level singleton state for remote sync
let isInitialized = false;
let realtimeChannel = null;

const initRemoteSync = () => {
  if (isInitialized) return;
  isInitialized = true;

  // 1. Initial Remote Fetch from Supabase for all devices
  const fetchRemoteSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('ecore_home_cms')
        .select('subtitle')
        .eq('section_type', 'site_settings')
        .order('id', { ascending: false })
        .limit(1);
      
      if (data && data.length > 0 && data[0].subtitle && !error) {
        try {
          const remoteParsed = JSON.parse(data[0].subtitle);
          const merged = { ...DEFAULT_SITE_SETTINGS, ...remoteParsed };
          currentSettings = merged;
          try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
          } catch (storageErr) {}
          
          listeners.forEach((listener) => {
            try { listener(merged); } catch (e) {}
          });
        } catch (pe) {
          console.warn('Could not parse remote settings JSON:', pe);
        }
      }
    } catch (err) {
      console.warn('Network notice: using cached settings:', err);
    }
  };

  fetchRemoteSettings();

  // 2. Realtime listener: Singleton subscription
  // Whenever settings change in Supabase from ANY device, update state across all open tabs/devices
  try {
    realtimeChannel = supabase
      .channel('enaksha_site_settings_singleton')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'ecore_home_cms' },
        (payload) => {
          const item = payload.new || payload.record;
          if (item && item.section_type === 'site_settings' && item.subtitle) {
            try {
              const liveParsed = JSON.parse(item.subtitle);
              const merged = { ...DEFAULT_SITE_SETTINGS, ...liveParsed };
              currentSettings = merged;
              try {
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
              } catch (storageErr) {}
              
              listeners.forEach((listener) => {
                try { listener(merged); } catch (e) {}
              });
            } catch (e) {
              console.warn('Realtime settings sync parse error:', e);
            }
          }
        }
      )
      .subscribe((status, err) => {
        if (err) {
          console.warn('Realtime channel subscription notice:', err);
        }
      });
  } catch (err) {
    console.warn('Realtime channel creation notice:', err);
  }
};

// Start sync once on module load in browser environment
if (typeof window !== 'undefined') {
  initRemoteSync();
}

// React hook for consuming and reacting to site settings across all devices
export const useSiteSettings = () => {
  const [settings, setSettings] = useState(currentSettings);

  useEffect(() => {
    initRemoteSync();

    const handleUpdate = (updated) => setSettings(updated);
    listeners.add(handleUpdate);

    // Keep in sync in case settings updated before effect ran
    setSettings(currentSettings);

    return () => {
      listeners.delete(handleUpdate);
    };
  }, []);

  return { settings, updateSettings: updateSiteSettings, defaultSettings: DEFAULT_SITE_SETTINGS };
};

