import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Activity, Search, Filter, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

interface RoleActivity {
  id: string;
  role_type: string;
  role_id: string;
  action_type: string;
  action_object: string | null;
  ip_address: string | null;
  device: string | null;
  geo_location: string | null;
  risk_flag: string;
  created_at: string;
}

interface LiveActivityViewProps {
  activities: RoleActivity[];
  isLoading: boolean;
}

const LiveActivityView = ({ activities, isLoading }: LiveActivityViewProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = 
      activity.action_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.action_object?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.role_type?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRisk = riskFilter === 'all' || activity.risk_flag === riskFilter;
    const matchesRole = roleFilter === 'all' || activity.role_type === roleFilter;
    
    return matchesSearch && matchesRisk && matchesRole;
  });

  const uniqueRoles = [...new Set(activities.map(a => a.role_type))];

  const getRiskIcon = (flag: string) => {
    switch (flag) {
      case 'red':
        return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case 'yellow':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  const getRiskColor = (flag: string) => {
    switch (flag) {
      case 'red':
        return 'border-l-destructive bg-destructive/5';
      case 'yellow':
        return 'border-l-yellow-500 bg-yellow-500/5';
      default:
        return 'border-l-green-500 bg-green-500/5';
    }
  };

  const stats = {
    total: activities.length,
    green: activities.filter(a => a.risk_flag === 'green').length,
    yellow: activities.filter(a => a.risk_flag === 'yellow').length,
    red: activities.filter(a => a.risk_flag === 'red').length,
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-card/50 backdrop-blur border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Activities</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-card/50 backdrop-blur border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.green}</p>
              <p className="text-sm text-muted-foreground">Normal</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-card/50 backdrop-blur border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-500/10">
              <Clock className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.yellow}</p>
              <p className="text-sm text-muted-foreground">Caution</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-card/50 backdrop-blur border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/10">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.red}</p>
              <p className="text-sm text-muted-foreground">High Risk</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-card/50 backdrop-blur border-border/50">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/50"
              />
            </div>
          </div>

          <Select value={riskFilter} onValueChange={setRiskFilter}>
            <SelectTrigger className="w-[150px] bg-background/50">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Risk Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Risks</SelectItem>
              <SelectItem value="green">Normal</SelectItem>
              <SelectItem value="yellow">Caution</SelectItem>
              <SelectItem value="red">High Risk</SelectItem>
            </SelectContent>
          </Select>

          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[180px] bg-background/50">
              <SelectValue placeholder="Filter by Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {uniqueRoles.map(role => (
                <SelectItem key={role} value={role}>{role}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Activity Feed */}
      <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Live Activity Feed
          <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary">
            Real-time
          </span>
        </h3>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No activities found</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            <AnimatePresence mode="popLayout">
              {filteredActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.02 }}
                  className={`p-4 rounded-lg border-l-4 ${getRiskColor(activity.risk_flag)} border border-border/30`}
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      {getRiskIcon(activity.risk_flag)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary font-medium">
                          {activity.role_type}
                        </span>
                        <span className="text-sm font-medium">{activity.action_type}</span>
                      </div>
                      
                      {activity.action_object && (
                        <p className="text-sm text-muted-foreground mt-1 truncate">
                          {activity.action_object}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        {activity.geo_location && (
                          <span>📍 {activity.geo_location}</span>
                        )}
                        {activity.device && (
                          <span>💻 {activity.device}</span>
                        )}
                        {activity.ip_address && (
                          <span>🌐 {activity.ip_address}</span>
                        )}
                        <span>
                          {format(new Date(activity.created_at), 'MMM d, HH:mm:ss')}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </Card>
    </div>
  );
};

export default LiveActivityView;
