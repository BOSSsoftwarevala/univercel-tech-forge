import React from 'react';
import { Card } from '@/components/ui/card';
import { Globe, Users, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

interface SuperAdmin {
  id: string;
  name: string;
  continent: string;
  login_status: string;
  countries_managed: number;
  risk_score: number;
  last_login_time: string | null;
}

interface GlobalMapViewProps {
  superAdmins: SuperAdmin[];
  isLoading: boolean;
}

const continents = [
  { name: 'North America', code: 'NA', x: '20%', y: '30%' },
  { name: 'South America', code: 'SA', x: '28%', y: '60%' },
  { name: 'Europe', code: 'EU', x: '48%', y: '25%' },
  { name: 'Africa', code: 'AF', x: '50%', y: '50%' },
  { name: 'Asia', code: 'AS', x: '70%', y: '35%' },
  { name: 'Oceania', code: 'OC', x: '82%', y: '65%' },
];

const GlobalMapView = ({ superAdmins, isLoading }: GlobalMapViewProps) => {
  const getContinentStats = (continent: string) => {
    const admins = superAdmins.filter(sa => 
      sa.continent?.toLowerCase().includes(continent.toLowerCase()) ||
      continent.toLowerCase().includes(sa.continent?.toLowerCase() || '')
    );
    return {
      total: admins.length,
      online: admins.filter(a => a.login_status === 'online').length,
      countries: admins.reduce((sum, a) => sum + (a.countries_managed || 0), 0)
    };
  };

  const totalOnline = superAdmins.filter(sa => sa.login_status === 'online').length;
  const totalCountries = superAdmins.reduce((sum, sa) => sum + (sa.countries_managed || 0), 0);
  const avgRiskScore = superAdmins.length > 0 
    ? Math.round(superAdmins.reduce((sum, sa) => sum + (sa.risk_score || 0), 0) / superAdmins.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-card/50 backdrop-blur border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{superAdmins.length}</p>
              <p className="text-sm text-muted-foreground">Total Super Admins</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-card/50 backdrop-blur border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <div className="w-5 h-5 rounded-full bg-green-500 animate-pulse" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalOnline}</p>
              <p className="text-sm text-muted-foreground">Online Now</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-card/50 backdrop-blur border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-chart-2/10">
              <Globe className="w-5 h-5 text-chart-2" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalCountries}</p>
              <p className="text-sm text-muted-foreground">Countries Covered</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-card/50 backdrop-blur border-border/50">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${avgRiskScore > 50 ? 'bg-destructive/10' : 'bg-green-500/10'}`}>
              <div className={`w-5 h-5 rounded-full ${avgRiskScore > 50 ? 'bg-destructive' : 'bg-green-500'}`} />
            </div>
            <div>
              <p className="text-2xl font-bold">{avgRiskScore}%</p>
              <p className="text-sm text-muted-foreground">Avg Risk Score</p>
            </div>
          </div>
        </Card>
      </div>

      {/* World Map */}
      <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
        <h3 className="text-lg font-semibold mb-4">Global Super Admin Distribution</h3>
        
        <div className="relative w-full h-[400px] bg-gradient-to-b from-background to-muted/20 rounded-lg overflow-hidden border border-border/30">
          {/* Simple World Map Visualization */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Globe className="w-64 h-64 text-muted-foreground/10" />
          </div>

          {/* Continent Markers */}
          {continents.map((continent) => {
            const stats = getContinentStats(continent.name);
            return (
              <motion.div
                key={continent.code}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: Math.random() * 0.5 }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{ left: continent.x, top: continent.y }}
              >
                <div className="relative">
                  {/* Pulse effect for online admins */}
                  {stats.online > 0 && (
                    <div className="absolute inset-0 w-8 h-8 rounded-full bg-green-500/30 animate-ping" />
                  )}
                  
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    stats.online > 0 ? 'bg-green-500' : 'bg-muted-foreground/30'
                  } transition-transform group-hover:scale-125`}>
                    <MapPin className="w-4 h-4 text-white" />
                  </div>

                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    <div className="bg-popover border border-border rounded-lg p-3 shadow-lg min-w-[150px]">
                      <p className="font-semibold text-sm">{continent.name}</p>
                      <div className="mt-2 space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Super Admins:</span>
                          <span>{stats.total}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Online:</span>
                          <span className="text-green-500">{stats.online}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Countries:</span>
                          <span>{stats.countries}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>

      {/* Super Admin List */}
      <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
        <h3 className="text-lg font-semibold mb-4">Super Admin Directory</h3>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : superAdmins.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No super admins registered yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {superAdmins.map((admin) => (
              <motion.div
                key={admin.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-lg border border-border/50 bg-background/50 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary-foreground">
                        {admin.name?.[0]?.toUpperCase() || 'S'}
                      </span>
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${
                      admin.login_status === 'online' ? 'bg-green-500' :
                      admin.login_status === 'away' ? 'bg-yellow-500' :
                      admin.login_status === 'busy' ? 'bg-orange-500' : 'bg-muted-foreground'
                    }`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{admin.name}</p>
                    <p className="text-sm text-muted-foreground">{admin.continent}</p>
                    <div className="mt-2 flex items-center gap-2 text-xs">
                      <span className="px-2 py-0.5 rounded-full bg-muted">
                        {admin.countries_managed} countries
                      </span>
                      {admin.risk_score > 50 && (
                        <span className="px-2 py-0.5 rounded-full bg-destructive/10 text-destructive">
                          Risk: {admin.risk_score}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default GlobalMapView;
