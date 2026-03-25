import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Shield, Cookie, Settings, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ConsentBannerProps {
  onAcceptAll?: () => void;
  onCustomize?: () => void;
}

export function ConsentBanner({ onAcceptAll, onCustomize }: ConsentBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [consents, setConsents] = useState({
    essential: true,
    analytics: false,
    marketing: false,
    thirdParty: false,
  });

  useEffect(() => {
    const stored = localStorage.getItem('cookie_consent');
    if (!stored) setIsVisible(true);
  }, []);

  const handleAcceptAll = async () => {
    const allConsents = { essential: true, analytics: true, marketing: true, thirdParty: true };
    setConsents(allConsents);
    localStorage.setItem('cookie_consent', JSON.stringify(allConsents));
    
    await supabase.from('cookie_consents').insert({
      session_id: crypto.randomUUID(),
      essential: true,
      analytics: true,
      marketing: true,
      third_party: true,
      preferences: true,
    });
    
    setIsVisible(false);
    onAcceptAll?.();
  };

  const handleSavePreferences = async () => {
    localStorage.setItem('cookie_consent', JSON.stringify(consents));
    
    await supabase.from('cookie_consents').insert({
      session_id: crypto.randomUUID(),
      essential: consents.essential,
      analytics: consents.analytics,
      marketing: consents.marketing,
      third_party: consents.thirdParty,
      preferences: true,
    });
    
    setIsVisible(false);
    onCustomize?.();
  };

  const handleRejectNonEssential = async () => {
    const minConsents = { essential: true, analytics: false, marketing: false, thirdParty: false };
    setConsents(minConsents);
    localStorage.setItem('cookie_consent', JSON.stringify(minConsents));
    
    await supabase.from('cookie_consents').insert({
      session_id: crypto.randomUUID(),
      essential: true,
      analytics: false,
      marketing: false,
      third_party: false,
      preferences: true,
    });
    
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background border-t border-border shadow-lg"
        >
          <div className="max-w-6xl mx-auto">
            {!showSettings ? (
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <Cookie className="h-8 w-8 text-primary shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground">Cookie & Privacy Consent</h3>
                    <p className="text-sm text-muted-foreground">
                      We use cookies to enhance your experience. By continuing, you agree to our use of cookies 
                      in accordance with GDPR, CCPA, and other privacy regulations.
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button variant="outline" size="sm" onClick={handleRejectNonEssential}>
                    Essential Only
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowSettings(true)}>
                    <Settings className="h-4 w-4 mr-1" /> Customize
                  </Button>
                  <Button size="sm" onClick={handleAcceptAll}>
                    Accept All
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Cookie Preferences
                  </h3>
                  <Button variant="ghost" size="icon" onClick={() => setShowSettings(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid gap-3">
                  {[
                    { key: 'essential', label: 'Essential', desc: 'Required for the website to function', disabled: true },
                    { key: 'analytics', label: 'Analytics', desc: 'Help us improve our services' },
                    { key: 'marketing', label: 'Marketing', desc: 'Personalized advertisements' },
                    { key: 'thirdParty', label: 'Third Party', desc: 'External service integrations' },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                      <Switch
                        checked={consents[item.key as keyof typeof consents]}
                        disabled={item.disabled}
                        onCheckedChange={(checked) => 
                          setConsents(prev => ({ ...prev, [item.key]: checked }))
                        }
                      />
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowSettings(false)}>Cancel</Button>
                  <Button onClick={handleSavePreferences}>Save Preferences</Button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
