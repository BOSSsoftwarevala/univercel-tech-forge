/**
 * COUNTRY VIEW - World Map with Lead Distribution
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, MapPin, Users, Ban, Check, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface CountryData {
  name: string;
  code: string;
  leads: number;
  converted: number;
  status: 'active' | 'blocked';
  continent: string;
}

const countries: CountryData[] = [
  { name: 'India', code: 'IN', leads: 847, converted: 234, status: 'active', continent: 'Asia' },
  { name: 'United States', code: 'US', leads: 523, converted: 189, status: 'active', continent: 'North America' },
  { name: 'United Kingdom', code: 'GB', leads: 312, converted: 98, status: 'active', continent: 'Europe' },
  { name: 'UAE', code: 'AE', leads: 287, converted: 87, status: 'active', continent: 'Asia' },
  { name: 'Nigeria', code: 'NG', leads: 198, converted: 45, status: 'active', continent: 'Africa' },
  { name: 'Australia', code: 'AU', leads: 156, converted: 67, status: 'active', continent: 'Oceania' },
  { name: 'Germany', code: 'DE', leads: 134, converted: 52, status: 'active', continent: 'Europe' },
  { name: 'Canada', code: 'CA', leads: 112, converted: 41, status: 'active', continent: 'North America' },
  { name: 'South Africa', code: 'ZA', leads: 89, converted: 23, status: 'blocked', continent: 'Africa' },
  { name: 'Brazil', code: 'BR', leads: 76, converted: 18, status: 'active', continent: 'South America' },
];

const continents = ['All', 'Asia', 'Europe', 'North America', 'Africa', 'Oceania', 'South America'];

export const CountryView: React.FC = () => {
  const [selectedContinent, setSelectedContinent] = useState('All');
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);

  const filteredCountries = countries.filter(c => 
    selectedContinent === 'All' || c.continent === selectedContinent
  );

  const totalLeads = filteredCountries.reduce((sum, c) => sum + c.leads, 0);
  const totalConverted = filteredCountries.reduce((sum, c) => sum + c.converted, 0);

  const handleViewLeads = (country: CountryData) => {
    toast.info(`Viewing leads from ${country.name}`);
  };

  const handleAssignTeam = (country: CountryData) => {
    toast.info(`Assigning local team for ${country.name}`);
  };

  const handleToggleStatus = (country: CountryData) => {
    const action = country.status === 'active' ? 'Blocked' : 'Allowed';
    toast.success(`${country.name} ${action}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-400" />
            Country View
          </h1>
          <p className="text-sm text-muted-foreground">Global lead distribution & management</p>
        </div>
        <Select value={selectedContinent} onValueChange={setSelectedContinent}>
          <SelectTrigger className="w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by Continent" />
          </SelectTrigger>
          <SelectContent>
            {continents.map(c => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-emerald-500/10 border-emerald-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Globe className="w-8 h-8 text-emerald-400" />
              <div>
                <p className="text-2xl font-bold text-emerald-400">{filteredCountries.length}</p>
                <p className="text-xs text-muted-foreground">Countries</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-500/10 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-2xl font-bold text-blue-400">{totalLeads.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Leads</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-violet-500/10 border-violet-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Check className="w-8 h-8 text-violet-400" />
              <div>
                <p className="text-2xl font-bold text-violet-400">{totalConverted.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Converted</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* World Map Placeholder + Country List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card/80 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">World Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 rounded-lg bg-muted/30 flex items-center justify-center border border-dashed border-border/50">
              <div className="text-center">
                <Globe className="w-16 h-16 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground">Interactive map visualization</p>
                <p className="text-xs text-muted-foreground">Click countries to view leads</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {continents.filter(c => c !== 'All').map(continent => (
                <Badge 
                  key={continent} 
                  variant="outline" 
                  className={`cursor-pointer ${selectedContinent === continent ? 'bg-emerald-500/20 text-emerald-400' : ''}`}
                  onClick={() => setSelectedContinent(continent)}
                >
                  {continent}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/80 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Country List</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-80 overflow-auto">
              {filteredCountries.map((country, idx) => (
                <motion.div
                  key={country.code}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setSelectedCountry(country)}
                  className={`p-3 border-b border-border/30 cursor-pointer transition-colors ${
                    selectedCountry?.code === country.code ? 'bg-emerald-500/10' : 'hover:bg-muted/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MapPin className={`w-4 h-4 ${country.status === 'active' ? 'text-emerald-400' : 'text-red-400'}`} />
                      <div>
                        <p className="font-medium text-foreground">{country.name}</p>
                        <p className="text-xs text-muted-foreground">{country.continent}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-foreground">{country.leads}</p>
                      <p className="text-xs text-muted-foreground">leads</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selected Country Actions */}
      {selectedCountry && (
        <Card className="bg-card/80 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{selectedCountry.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedCountry.leads} leads • {selectedCountry.converted} converted • 
                    {Math.round((selectedCountry.converted / selectedCountry.leads) * 100)}% conversion rate
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={() => handleViewLeads(selectedCountry)}>
                  <Users className="w-4 h-4 mr-2" />
                  View Leads
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleAssignTeam(selectedCountry)}>
                  Assign Team
                </Button>
                <Button 
                  size="sm" 
                  variant={selectedCountry.status === 'active' ? 'destructive' : 'default'}
                  onClick={() => handleToggleStatus(selectedCountry)}
                >
                  {selectedCountry.status === 'active' ? <Ban className="w-4 h-4 mr-1" /> : <Check className="w-4 h-4 mr-1" />}
                  {selectedCountry.status === 'active' ? 'Block' : 'Allow'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
