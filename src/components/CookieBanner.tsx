import React, { useState, useEffect } from 'react';
import { ShieldCheck, X, Eye, Check, Settings, Info } from 'lucide-react';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  resolved: boolean;
}

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [view, setView] = useState<'standard' | 'customize'>('standard');
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: true,
    marketing: false,
    resolved: false
  });

  useEffect(() => {
    const saved = localStorage.getItem('anjuman_cookie_consent');
    if (!saved) {
      // Delay display slightly for a premium entrance feel
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.resolved) {
          setShowBanner(true);
        }
      } catch (e) {
        setShowBanner(true);
      }
    }
  }, []);

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('anjuman_cookie_consent', JSON.stringify({ ...prefs, resolved: true }));
    setPreferences({ ...prefs, resolved: true });
    setShowBanner(false);
  };

  const handleAcceptAll = () => {
    savePreferences({
      essential: true,
      analytics: true,
      marketing: true,
      resolved: true
    });
  };

  const handleRejectNonEssential = () => {
    savePreferences({
      essential: true,
      analytics: false,
      marketing: false,
      resolved: true
    });
  };

  const handleCustomSave = () => {
    savePreferences({
      ...preferences,
      resolved: true
    });
  };

  const togglePreference = (key: keyof Omit<CookiePreferences, 'resolved' | 'essential'>) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (!showBanner) return null;

  return (
    <div 
      className="fixed bottom-6 left-6 right-6 md:left-auto md:max-w-md z-50 animate-fade-in"
      id="anjuman-global-cookie-consenter"
    >
      <div className="bg-white text-gray-900 border border-gray-200 rounded-2xl shadow-2xl p-5 md:p-6 space-y-4">
        
        {view === 'standard' ? (
          <div className="space-y-4">
            
            {/* Header */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg shrink-0 border border-amber-200">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center justify-between">
                  <span>Privacy & Cookie Consent</span>
                  <button 
                    onClick={handleRejectNonEssential}
                    className="p-1 text-gray-400 hover:text-gray-900 rounded-full"
                    title="Dismiss and reject non-essential"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </h4>
                <p className="text-[11px] text-gray-600 leading-relaxed font-sans">
                  Namaste! Anjuman 5-Star Palace Hotel uses cookies to analyze secure web traffic, customize premium suite reservation histories, and comply with the **Digital Personal Data Protection (DPDP) Act 2023** of India. 
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2 pt-1 text-[10px] uppercase font-bold tracking-wider">
              <button 
                onClick={handleAcceptAll}
                className="flex-1 py-2.5 bg-gray-900 text-white hover:bg-gray-850 rounded-lg text-center transition-all cursor-pointer border border-transparent shadow-sm"
              >
                Accept All
              </button>
              
              <button 
                onClick={() => setView('customize')}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-center transition-all cursor-pointer border border-gray-200 flex items-center justify-center gap-1"
              >
                <Settings className="w-3.5 h-3.5" />
                Customize
              </button>

              <button 
                onClick={handleRejectNonEssential}
                className="flex-1 py-2.5 bg-transparent hover:bg-gray-50 text-gray-500 rounded-lg text-center transition-all cursor-pointer border border-gray-200"
              >
                Minimal Only
              </button>
            </div>

            {/* Legal context reference link */}
            <div className="text-[9px] text-gray-400 font-mono flex items-center justify-between pt-1 border-t border-gray-100">
              <span className="flex items-center gap-1">
                <Info className="w-3 h-3 text-gray-400" />
                GDPR + DPDP Compliant
              </span>
              <span>v1.0.0</span>
            </div>

          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            
            {/* Customize View */}
            <div className="space-y-1">
              <h4 className="font-serif text-sm font-bold text-gray-900 uppercase">Customize Preferences</h4>
              <p className="text-[10px] text-gray-500">Configure what cookie modules you allow on your device.</p>
            </div>

            <div className="space-y-2.5 pt-1.5 text-xs">
              
              {/* Essential: Locked */}
              <div className="flex items-center justify-between p-2.5 bg-gray-50 border border-gray-100 rounded-lg">
                <div>
                  <span className="font-bold text-gray-800 block">1. Essential Cookies</span>
                  <p className="text-[10px] text-gray-500">Suite bookings tracking, secure session logging, and token cache memory.</p>
                </div>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[8px] font-bold border border-emerald-200 rounded">REQUIRED</span>
              </div>

              {/* Analytics */}
              <div 
                onClick={() => togglePreference('analytics')}
                className="flex items-center justify-between p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-all"
              >
                <div>
                  <span className="font-bold text-gray-800 block">2. Performance & Analytics</span>
                  <p className="text-[10px] text-gray-500">Google Analytics logs, load speed diagnostics, and browser layout diagnostics.</p>
                </div>
                <div className={`w-9 h-5 rounded-full transition-colors flex items-center p-0.5 ${preferences.analytics ? 'bg-gray-900' : 'bg-gray-200'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${preferences.analytics ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
              </div>

              {/* Marketing */}
              <div 
                onClick={() => togglePreference('marketing')}
                className="flex items-center justify-between p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-all"
              >
                <div>
                  <span className="font-bold text-gray-800 block">3. Marketing & Ads</span>
                  <p className="text-[10px] text-gray-500">Personalized royal package newsletters, banners, and retargeting ads.</p>
                </div>
                <div className={`w-9 h-5 rounded-full transition-colors flex items-center p-0.5 ${preferences.marketing ? 'bg-gray-900' : 'bg-gray-200'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${preferences.marketing ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
              </div>

            </div>

            {/* Back & Save */}
            <div className="flex justify-between items-center pt-2 gap-2 text-[10px] uppercase font-bold tracking-wider">
              <button 
                onClick={() => setView('standard')}
                className="py-2.5 px-4 bg-transparent border border-gray-200 hover:bg-gray-50 text-gray-500 rounded-lg cursor-pointer"
              >
                Back
              </button>
              <button 
                onClick={handleCustomSave}
                className="flex-1 py-2.5 bg-gray-900 text-white hover:bg-gray-850 rounded-lg text-center transition-all cursor-pointer flex items-center justify-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                Save Preferences
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
