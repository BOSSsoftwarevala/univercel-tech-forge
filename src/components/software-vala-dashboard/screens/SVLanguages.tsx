/**
 * LANGUAGES SCREEN
 * Table with language support toggles
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Plus,
  CheckCircle2,
  XCircle,
  Volume2,
  Mic,
  Languages as LanguagesIcon
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Language {
  id: string;
  name: string;
  code: string;
  enabled: boolean;
  ttsSupport: boolean;
  sttSupport: boolean;
  translationSupport: boolean;
}

const initialLanguages: Language[] = [
  { id: '1', name: 'English', code: 'en', enabled: true, ttsSupport: true, sttSupport: true, translationSupport: true },
  { id: '2', name: 'Hindi', code: 'hi', enabled: true, ttsSupport: true, sttSupport: true, translationSupport: true },
  { id: '3', name: 'Spanish', code: 'es', enabled: true, ttsSupport: true, sttSupport: true, translationSupport: true },
  { id: '4', name: 'French', code: 'fr', enabled: true, ttsSupport: true, sttSupport: true, translationSupport: true },
  { id: '5', name: 'German', code: 'de', enabled: true, ttsSupport: true, sttSupport: false, translationSupport: true },
  { id: '6', name: 'Japanese', code: 'ja', enabled: false, ttsSupport: true, sttSupport: true, translationSupport: true },
  { id: '7', name: 'Chinese (Mandarin)', code: 'zh', enabled: true, ttsSupport: true, sttSupport: true, translationSupport: true },
  { id: '8', name: 'Arabic', code: 'ar', enabled: false, ttsSupport: true, sttSupport: false, translationSupport: true },
  { id: '9', name: 'Portuguese', code: 'pt', enabled: true, ttsSupport: true, sttSupport: true, translationSupport: true },
  { id: '10', name: 'Russian', code: 'ru', enabled: false, ttsSupport: false, sttSupport: false, translationSupport: true },
];

export const SVLanguages: React.FC = () => {
  const [languages, setLanguages] = useState<Language[]>(initialLanguages);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLanguages = languages.filter(lang =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggle = (id: string, field: keyof Language) => {
    setLanguages(prev => prev.map(lang =>
      lang.id === id ? { ...lang, [field]: !lang[field] } : lang
    ));
    toast({ title: 'Language Updated' });
  };

  const SupportBadge = ({ supported, label }: { supported: boolean; label: string }) => (
    <div className="flex items-center gap-1.5">
      {supported ? (
        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
      ) : (
        <XCircle className="w-4 h-4 text-slate-300" />
      )}
      <span className={`text-xs ${supported ? 'text-slate-700' : 'text-slate-400'}`}>{label}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Languages</h1>
          <p className="text-slate-500 text-sm mt-1">Configure language support for AI services</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Language
        </Button>
      </div>

      {/* Search & Stats */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search languages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white"
          />
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
            {languages.filter(l => l.enabled).length} Active
          </Badge>
          <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200">
            {languages.length} Total
          </Badge>
        </div>
      </div>

      {/* Table */}
      <Card className="bg-white border-slate-200 shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Language</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  <div className="flex items-center justify-center gap-1">
                    <Volume2 className="w-3.5 h-3.5" /> TTS
                  </div>
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  <div className="flex items-center justify-center gap-1">
                    <Mic className="w-3.5 h-3.5" /> STT
                  </div>
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  <div className="flex items-center justify-center gap-1">
                    <LanguagesIcon className="w-3.5 h-3.5" /> Translation
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLanguages.map((lang) => (
                <tr key={lang.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-sm font-semibold text-blue-700">
                        {lang.code.toUpperCase()}
                      </div>
                      <span className="font-medium text-slate-800">{lang.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Switch
                      checked={lang.enabled}
                      onCheckedChange={() => handleToggle(lang.id, 'enabled')}
                    />
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center">
                      <SupportBadge supported={lang.ttsSupport} label="Text-to-Speech" />
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center">
                      <SupportBadge supported={lang.sttSupport} label="Speech-to-Text" />
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center">
                      <SupportBadge supported={lang.translationSupport} label="Translation" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
