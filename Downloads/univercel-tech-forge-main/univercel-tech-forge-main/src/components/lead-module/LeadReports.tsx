/**
 * LEAD REPORTS
 * Source, Country, Conversion, Team performance
 */
import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, Radio, Globe, TrendingUp, Users, 
  Download, RefreshCw, Calendar 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

const sourcePerformance = [
  { source: 'Google Ads', leads: 856, converted: 312, rate: 36, cost: '$2,450' },
  { source: 'Facebook', leads: 623, converted: 198, rate: 32, cost: '$1,890' },
  { source: 'Website Forms', leads: 512, converted: 189, rate: 37, cost: '$0' },
  { source: 'WhatsApp', leads: 345, converted: 134, rate: 39, cost: '$120' },
  { source: 'Manual Entry', leads: 234, converted: 89, rate: 38, cost: '$0' },
];

const countryPerformance = [
  { country: 'India', leads: 847, converted: 312, rate: 37 },
  { country: 'USA', leads: 523, converted: 189, rate: 36 },
  { country: 'UK', leads: 312, converted: 98, rate: 31 },
  { country: 'UAE', leads: 287, converted: 112, rate: 39 },
  { country: 'Nigeria', leads: 198, converted: 67, rate: 34 },
];

const teamPerformance = [
  { team: 'Sales Team India', assigned: 456, converted: 178, rate: 39 },
  { team: 'Sales Team US', assigned: 312, converted: 112, rate: 36 },
  { team: 'Franchise Sales', assigned: 234, converted: 89, rate: 38 },
  { team: 'Partner Team', assigned: 189, converted: 67, rate: 35 },
];

export const LeadReports: React.FC = () => {
  const handleExport = (type: string) => toast.success(`Exporting ${type} report...`);
  const handleRefresh = () => toast.info('Refreshing report data...');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            Lead Reports
          </h1>
          <p className="text-sm text-muted-foreground">Performance analytics & insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('PDF')}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Source Performance */}
      <Card className="bg-card/80 border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Radio className="w-4 h-4 text-blue-400" />
            Source Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-4 text-xs text-muted-foreground uppercase">Source</th>
                  <th className="text-center py-3 px-4 text-xs text-muted-foreground uppercase">Leads</th>
                  <th className="text-center py-3 px-4 text-xs text-muted-foreground uppercase">Converted</th>
                  <th className="text-center py-3 px-4 text-xs text-muted-foreground uppercase">Rate</th>
                  <th className="text-right py-3 px-4 text-xs text-muted-foreground uppercase">Cost</th>
                </tr>
              </thead>
              <tbody>
                {sourcePerformance.map((item, idx) => (
                  <motion.tr
                    key={item.source}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.08 }}
                    className="border-b border-border/30 hover:bg-muted/30"
                  >
                    <td className="py-3 px-4 font-medium text-foreground">{item.source}</td>
                    <td className="py-3 px-4 text-center text-foreground">{item.leads}</td>
                    <td className="py-3 px-4 text-center text-foreground">{item.converted}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Progress value={item.rate} className="flex-1 h-2" />
                        <span className="text-sm w-10 text-right">{item.rate}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right text-foreground">{item.cost}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Country Performance */}
        <Card className="bg-card/80 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              Country Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {countryPerformance.map((item, idx) => (
                <motion.div
                  key={item.country}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.08 }}
                  className="p-4 hover:bg-muted/30"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">{item.country}</span>
                    <Badge variant="outline">{item.rate}%</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{item.leads} leads</span>
                    <span>{item.converted} converted</span>
                  </div>
                  <Progress value={item.rate} className="h-1.5 mt-2" />
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Team Performance */}
        <Card className="bg-card/80 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Users className="w-4 h-4 text-violet-400" />
              Team Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {teamPerformance.map((item, idx) => (
                <motion.div
                  key={item.team}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.08 }}
                  className="p-4 hover:bg-muted/30"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">{item.team}</span>
                    <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400">{item.rate}%</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{item.assigned} assigned</span>
                    <span>{item.converted} converted</span>
                  </div>
                  <Progress value={item.rate} className="h-1.5 mt-2" />
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card/80 border-border/50 hover:border-emerald-500/30 transition-colors cursor-pointer" onClick={() => handleExport('Daily')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="font-medium text-foreground">Daily Summary</p>
                <p className="text-xs text-muted-foreground">Today's lead activity</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/80 border-border/50 hover:border-blue-500/30 transition-colors cursor-pointer" onClick={() => handleExport('Weekly')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="font-medium text-foreground">Weekly Trends</p>
                <p className="text-xs text-muted-foreground">7-day performance</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/80 border-border/50 hover:border-violet-500/30 transition-colors cursor-pointer" onClick={() => handleExport('Conversion')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <p className="font-medium text-foreground">Conversion Report</p>
                <p className="text-xs text-muted-foreground">Full funnel analysis</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
