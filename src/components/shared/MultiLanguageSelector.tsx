import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  isRTL: boolean;
}

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', isRTL: false },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', isRTL: false },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', isRTL: false },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', isRTL: false },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳', isRTL: false },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', isRTL: false },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳', isRTL: false },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', isRTL: false },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳', isRTL: false },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳', isRTL: false },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', isRTL: true },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱', isRTL: true },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', flag: '🇮🇷', isRTL: true },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰', isRTL: true },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', isRTL: false },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', isRTL: false },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', isRTL: false },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', isRTL: false },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', isRTL: false },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', isRTL: false },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', isRTL: false },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', isRTL: false },
];

// Regex patterns for masked IDs that should NOT be translated
const MASKED_ID_PATTERNS = [
  /^[A-Z]{2,4}-\*{3,4}-\d{4}$/,  // SA-****-7842
  /^[A-Z]{2,4}-\d{4}$/,          // EMP-042
  /^USR-[A-Z0-9]{4}\*{3}$/,      // USR-XXXX***
  /^BOSS-\d{2}$/,                // BOSS-01
  /^vala\([a-z]+\)\d{4}$/,       // vala(sales)4771
  /^[A-Z]+-[A-Z0-9]+-[A-Z0-9]+$/, // Generic masked format
];

interface MultiLanguageSelectorProps {
  compact?: boolean;
  onLanguageChange?: (language: Language) => void;
}

export function MultiLanguageSelector({ compact = false, onLanguageChange }: MultiLanguageSelectorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(languages[0]);

  // Load saved language preference
  useEffect(() => {
    const saved = localStorage.getItem('sv_language');
    if (saved) {
      const found = languages.find(l => l.code === saved);
      if (found) {
        setSelectedLanguage(found);
        applyRTL(found.isRTL);
      }
    }
  }, []);

  const applyRTL = (isRTL: boolean) => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = selectedLanguage.code;
  };

  const handleSelect = async (language: Language) => {
    setSelectedLanguage(language);
    applyRTL(language.isRTL);
    localStorage.setItem('sv_language', language.code);
    
    // Log language change for audit (masked user ID)
    try {
      await supabase.from('audit_logs').insert({
        action: 'language_change',
        module: 'localization',
        meta_json: {
          from_lang: selectedLanguage.code,
          to_lang: language.code,
          is_rtl: language.isRTL,
          timestamp: new Date().toISOString(),
        }
      });
    } catch (err) {
      console.error('Failed to log language change:', err);
    }
    
    onLanguageChange?.(language);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={compact ? "sm" : "default"}
          className="gap-2 bg-background/20 backdrop-blur-sm border border-border/30 hover:bg-background/40"
        >
          <Globe className="w-4 h-4 text-primary" />
          {!compact && (
            <>
              <span className="text-sm">{selectedLanguage.flag}</span>
              <span className="text-sm font-medium">{selectedLanguage.code.toUpperCase()}</span>
              {selectedLanguage.isRTL && (
                <span className="text-[10px] text-muted-foreground">(RTL)</span>
              )}
            </>
          )}
          <ChevronDown className="w-3 h-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-64 max-h-80 overflow-auto bg-background/95 backdrop-blur-xl border-border/50"
      >
        <div className="p-2 border-b border-border/30">
          <p className="text-xs text-muted-foreground font-medium px-2">Select Language</p>
        </div>
        <div className="py-1">
          {languages.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => handleSelect(language)}
              className="flex items-center justify-between gap-3 cursor-pointer py-2"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{language.flag}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{language.name}</p>
                    {language.isRTL && (
                      <span className="text-[10px] px-1 py-0.5 rounded bg-primary/10 text-primary">RTL</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{language.nativeName}</p>
                </div>
              </div>
              {selectedLanguage.code === language.code && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center"
                >
                  <Check className="w-3 h-3 text-primary" />
                </motion.div>
              )}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Utility function to check if text contains masked ID (should not be translated)
export function containsMaskedId(text: string): boolean {
  const words = text.split(/\s+/);
  return words.some(word => MASKED_ID_PATTERNS.some(pattern => pattern.test(word)));
}

// Utility function to preserve masked IDs during translation
export function preserveMaskedIds(originalText: string, translatedText: string): string {
  const words = originalText.split(/\s+/);
  const maskedIds = words.filter(word => MASKED_ID_PATTERNS.some(pattern => pattern.test(word)));
  
  if (maskedIds.length === 0) return translatedText;
  
  // Replace any potentially translated masked IDs back to original
  let result = translatedText;
  maskedIds.forEach(maskedId => {
    // Check if the masked ID is missing from translation
    if (!result.includes(maskedId)) {
      // Append it to maintain audit trail
      result = result + ` [${maskedId}]`;
    }
  });
  
  return result;
}

export default MultiLanguageSelector;
