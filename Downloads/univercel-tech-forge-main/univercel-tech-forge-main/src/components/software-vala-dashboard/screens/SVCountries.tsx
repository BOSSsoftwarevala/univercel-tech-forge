/**
 * COUNTRIES SCREEN
 * Country grid with compliance status
 */

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Plus,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Globe2
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Country {
  id: string;
  name: string;
  code: string;
  enabled: boolean;
  languages: string[];
  complianceStatus: 'compliant' | 'pending' | 'non-compliant';
}

const initialCountries: Country[] = [
  { id: '1', name: 'India', code: 'IN', enabled: true, languages: ['Hindi', 'English', 'Tamil'], complianceStatus: 'compliant' },
  { id: '2', name: 'United States', code: 'US', enabled: true, languages: ['English', 'Spanish'], complianceStatus: 'compliant' },
  { id: '3', name: 'United Kingdom', code: 'GB', enabled: true, languages: ['English'], complianceStatus: 'compliant' },
  { id: '4', name: 'Germany', code: 'DE', enabled: true, languages: ['German', 'English'], complianceStatus: 'compliant' },
  { id: '5', name: 'France', code: 'FR', enabled: true, languages: ['French', 'English'], complianceStatus: 'pending' },
  { id: '6', name: 'Brazil', code: 'BR', enabled: true, languages: ['Portuguese'], complianceStatus: 'compliant' },
  { id: '7', name: 'Japan', code: 'JP', enabled: false, languages: ['Japanese', 'English'], complianceStatus: 'pending' },
  { id: '8', name: 'China', code: 'CN', enabled: false, languages: ['Chinese'], complianceStatus: 'non-compliant' },
  { id: '9', name: 'Australia', code: 'AU', enabled: true, languages: ['English'], complianceStatus: 'compliant' },
  { id: '10', name: 'Canada', code: 'CA', enabled: true, languages: ['English', 'French'], complianceStatus: 'compliant' },
  { id: '11', name: 'Mexico', code: 'MX', enabled: false, languages: ['Spanish'], complianceStatus: 'pending' },
  { id: '12', name: 'South Korea', code: 'KR', enabled: true, languages: ['Korean', 'English'], complianceStatus: 'compliant' },
];

const complianceConfig = {
  compliant: { icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', label: 'Compliant' },
  pending: { icon: Shield, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', label: 'Pending' },
  'non-compliant': { icon: ShieldAlert, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', label: 'Non-Compliant' }
};

export const SVCountries: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>(initialCountries);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggle = (id: string) => {
    setCountries(prev => prev.map(c =>
      c.id === id ? { ...c, enabled: !c.enabled } : c
    ));
    toast({ title: 'Country Updated' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Countries</h1>
          <p className="text-slate-500 text-sm mt-1">Manage regional availability and compliance</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Country
        </Button>
      </div>

      {/* Search & Stats */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search countries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white"
          />
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
            {countries.filter(c => c.enabled).length} Active
          </Badge>
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
            {countries.filter(c => c.complianceStatus === 'compliant').length} Compliant
          </Badge>
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            {countries.filter(c => c.complianceStatus === 'pending').length} Pending
          </Badge>
        </div>
      </div>

      {/* Countries Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredCountries.map((country) => {
          const compliance = complianceConfig[country.complianceStatus];
          const ComplianceIcon = compliance.icon;

          return (
            <Card 
              key={country.id} 
              className={`bg-white border-slate-200 shadow-sm hover:shadow-md transition-all rounded-xl ${
                !country.enabled ? 'opacity-75' : ''
              }`}
            >
              <CardContent className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-sm font-bold text-blue-700">
                      {country.code}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 text-sm">{country.name}</h3>
                      <Badge 
                        variant="outline" 
                        className={`text-[10px] mt-1 ${compliance.bg} ${compliance.color} ${compliance.border}`}
                      >
                        <ComplianceIcon className="w-3 h-3 mr-1" />
                        {compliance.label}
                      </Badge>
                    </div>
                  </div>
                  <Switch
                    checked={country.enabled}
                    onCheckedChange={() => handleToggle(country.id)}
                  />
                </div>

                {/* Languages */}
                <div className="pt-3 border-t border-slate-100">
                  <p className="text-xs text-slate-500 mb-2">Supported Languages</p>
                  <div className="flex flex-wrap gap-1">
                    {country.languages.map((lang, idx) => (
                      <Badge 
                        key={idx} 
                        variant="outline" 
                        className="text-[10px] bg-slate-50 text-slate-600 border-slate-200"
                      >
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
