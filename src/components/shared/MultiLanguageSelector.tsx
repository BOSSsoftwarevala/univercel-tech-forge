import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
];

interface MultiLanguageSelectorProps {
  compact?: boolean;
  onLanguageChange?: (language: Language) => void;
}

export function MultiLanguageSelector({ compact = false, onLanguageChange }: MultiLanguageSelectorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(languages[0]);

  const handleSelect = (language: Language) => {
    setSelectedLanguage(language);
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
                  <p className="text-sm font-medium">{language.name}</p>
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

export default MultiLanguageSelector;
