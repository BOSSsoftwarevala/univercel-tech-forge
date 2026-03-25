/**
 * MULTI-LANGUAGE SUPPORT SCREEN
 * Configure language settings
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Languages,
  Plus,
  Globe,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Language {
  id: string;
  name: string;
  code: string;
  flag: string;
  enabled: boolean;
  autoTranslate: boolean;
  coverage: number;
}

const initialLanguages: Language[] = [
  { id: '1', name: 'English', code: 'en', flag: '🇺🇸', enabled: true, autoTranslate: false, coverage: 100 },
  { id: '2', name: 'Hindi', code: 'hi', flag: '🇮🇳', enabled: true, autoTranslate: true, coverage: 95 },
  { id: '3', name: 'Spanish', code: 'es', flag: '🇪🇸', enabled: true, autoTranslate: true, coverage: 92 },
  { id: '4', name: 'French', code: 'fr', flag: '🇫🇷', enabled: true, autoTranslate: true, coverage: 88 },
  { id: '5', name: 'German', code: 'de', flag: '🇩🇪', enabled: false, autoTranslate: true, coverage: 85 },
  { id: '6', name: 'Japanese', code: 'ja', flag: '🇯🇵', enabled: false, autoTranslate: true, coverage: 78 },
  { id: '7', name: 'Portuguese', code: 'pt', flag: '🇧🇷', enabled: true, autoTranslate: true, coverage: 90 },
  { id: '8', name: 'Chinese', code: 'zh', flag: '🇨🇳', enabled: false, autoTranslate: true, coverage: 72 },
];

export const CBMultiLanguage: React.FC = () => {
  const [languages, setLanguages] = useState<Language[]>(initialLanguages);
  const [fallbackLang, setFallbackLang] = useState('en');
  const [autoTranslateAll, setAutoTranslateAll] = useState(true);

  const toggleLanguage = (id: string, field: 'enabled' | 'autoTranslate') => {
    setLanguages(prev => prev.map(l => 
      l.id === id ? { ...l, [field]: !l[field] } : l
    ));
    toast({ title: 'Language settings updated' });
  };

  const enabledCount = languages.filter(l => l.enabled).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Language Support</h1>
          <p className="text-slate-500 text-sm mt-1">Configure multi-language chatbot responses</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Language
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="flex items-center gap-4 flex-wrap">
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1">
          🌐 {enabledCount} Languages Active
        </Badge>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1">
          🤖 Auto-translation {autoTranslateAll ? 'ON' : 'OFF'}
        </Badge>
        <Badge variant="outline" className="bg-violet-50 text-violet-700 border-violet-200 px-3 py-1">
          🔄 Fallback: English
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Panel */}
        <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              Translation Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium text-slate-800 text-sm">Auto-Translate Messages</p>
                <p className="text-xs text-slate-500">Automatically translate user messages</p>
              </div>
              <Switch
                checked={autoTranslateAll}
                onCheckedChange={setAutoTranslateAll}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Fallback Language
              </label>
              <Select value={fallbackLang} onValueChange={setFallbackLang}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.filter(l => l.enabled).map(l => (
                    <SelectItem key={l.id} value={l.code}>
                      {l.flag} {l.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500 mt-1.5">
                Used when language detection fails
              </p>
            </div>

            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                💡 Pro tip: Enable auto-translation for better global support coverage
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Languages List */}
        <Card className="lg:col-span-2 bg-white border-slate-200 shadow-sm rounded-xl">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Languages className="w-5 h-5 text-blue-600" />
              Enabled Languages
            </CardTitle>
            <CardDescription>Toggle languages and auto-translation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {languages.map((lang) => (
                <div 
                  key={lang.id}
                  className={`flex items-center justify-between p-4 rounded-xl border ${
                    lang.enabled 
                      ? 'bg-white border-slate-200' 
                      : 'bg-slate-50 border-slate-100 opacity-75'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{lang.flag}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-800">{lang.name}</span>
                        <Badge variant="outline" className="text-[10px]">{lang.code.toUpperCase()}</Badge>
                        {lang.code === fallbackLang && (
                          <Badge className="bg-violet-100 text-violet-700 text-[10px]">Fallback</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              lang.coverage >= 90 ? 'bg-emerald-500' : 
                              lang.coverage >= 70 ? 'bg-amber-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${lang.coverage}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-500">{lang.coverage}% coverage</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">Auto-translate</span>
                      <Switch
                        checked={lang.autoTranslate}
                        onCheckedChange={() => toggleLanguage(lang.id, 'autoTranslate')}
                        disabled={!lang.enabled || lang.code === 'en'}
                        className="scale-75"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">Enabled</span>
                      <Switch
                        checked={lang.enabled}
                        onCheckedChange={() => toggleLanguage(lang.id, 'enabled')}
                        disabled={lang.code === fallbackLang}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
