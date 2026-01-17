/**
 * COUNTRY / REGION VIEW
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Globe, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const countries = [
  { country: 'India', leads: 456, converted: 89, rate: 19.5, flag: '🇮🇳' },
  { country: 'USA', leads: 234, converted: 45, rate: 19.2, flag: '🇺🇸' },
  { country: 'UAE', leads: 123, converted: 34, rate: 27.6, flag: '🇦🇪' },
  { country: 'UK', leads: 98, converted: 21, rate: 21.4, flag: '🇬🇧' },
  { country: 'Australia', leads: 67, converted: 15, rate: 22.4, flag: '🇦🇺' },
  { country: 'Germany', leads: 54, converted: 12, rate: 22.2, flag: '🇩🇪' },
  { country: 'Canada', leads: 43, converted: 9, rate: 20.9, flag: '🇨🇦' },
  { country: 'Singapore', leads: 38, converted: 11, rate: 28.9, flag: '🇸🇬' },
];

export const CountryRegion: React.FC = () => {
  const totalLeads = countries.reduce((sum, c) => sum + c.leads, 0);
  const totalConverted = countries.reduce((sum, c) => sum + c.converted, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Globe className="w-5 h-5 text-emerald-400" />
          Country / Region
        </h1>
        <p className="text-sm text-muted-foreground">Lead distribution by geography</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-card/80 border-border/50">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Countries</p>
            <p className="text-2xl font-bold text-foreground">{countries.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-card/80 border-border/50">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Leads</p>
            <p className="text-2xl font-bold text-foreground">{totalLeads}</p>
          </CardContent>
        </Card>
        <Card className="bg-card/80 border-border/50">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Avg Conversion</p>
            <p className="text-2xl font-bold text-foreground">{((totalConverted / totalLeads) * 100).toFixed(1)}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Country List */}
      <Card className="bg-card/80 border-border/50">
        <CardContent className="p-4">
          <div className="space-y-3">
            {countries.map((item, idx) => (
              <motion.div
                key={item.country}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors"
              >
                <span className="text-2xl">{item.flag}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-foreground">{item.country}</span>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Users className="w-3.5 h-3.5" /> {item.leads}
                      </span>
                      <span className="flex items-center gap-1 text-emerald-400">
                        <TrendingUp className="w-3.5 h-3.5" /> {item.converted}
                      </span>
                      <Badge variant="outline">{item.rate}%</Badge>
                    </div>
                  </div>
                  <Progress value={(item.leads / totalLeads) * 100} className="h-1.5" />
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
