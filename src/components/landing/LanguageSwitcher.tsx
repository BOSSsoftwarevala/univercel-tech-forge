import { motion } from 'framer-motion';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface LanguageSwitcherProps {
  compact?: boolean;
}

export function LanguageSwitcher({ compact = false }: LanguageSwitcherProps) {
  const { currentLanguage, setLanguage, availableLanguages, isRTL } = useTranslation();
  
  const currentLang = availableLanguages.find(l => l.code === currentLanguage) || availableLanguages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={compact ? "sm" : "default"}
          className="gap-2 bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 text-white"
        >
          <Globe className="w-4 h-4 text-cyan-400" />
          {!compact && (
            <>
              <span className="text-lg">{currentLang.flag}</span>
              <span className="text-sm font-medium">{currentLang.code.toUpperCase()}</span>
            </>
          )}
          <ChevronDown className="w-3 h-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align={isRTL ? "start" : "end"}
        className="w-56 max-h-80 overflow-auto bg-[#0a0a0f]/95 backdrop-blur-xl border-white/10"
      >
        <div className="p-2 border-b border-white/10">
          <p className="text-xs text-slate-400 font-medium px-2">Select Language</p>
        </div>
        <div className="py-1">
          {availableLanguages.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => setLanguage(language.code)}
              className="flex items-center justify-between gap-3 cursor-pointer py-2.5 text-white hover:bg-white/10"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{language.flag}</span>
                <span className="text-sm font-medium">{language.name}</span>
              </div>
              {currentLanguage === language.code && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center"
                >
                  <Check className="w-3 h-3 text-cyan-400" />
                </motion.div>
              )}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}