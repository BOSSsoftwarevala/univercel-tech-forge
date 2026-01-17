/**
 * DEMO MANAGEMENT
 * Demo cards with actions
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Monitor, ExternalLink, RotateCcw, CalendarPlus, Trash2,
  Search, Filter, Clock, Globe
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const mockDemos = [
  { id: '1', name: 'School ERP - Demo 1', product: 'School ERP Pro', domain: 'demo1.school.softwarevala.com', status: 'live', lastUpdated: '2 hours ago' },
  { id: '2', name: 'School ERP - Demo 2', product: 'School ERP Pro', domain: 'demo2.school.softwarevala.com', status: 'live', lastUpdated: '5 hours ago' },
  { id: '3', name: 'Hospital Demo', product: 'Hospital Management', domain: 'demo.hospital.softwarevala.com', status: 'expired', lastUpdated: '3 days ago' },
  { id: '4', name: 'Restaurant Demo', product: 'Restaurant POS', domain: 'demo.restaurant.softwarevala.com', status: 'live', lastUpdated: '1 day ago' },
  { id: '5', name: 'Real Estate Demo', product: 'Real Estate CRM', domain: 'demo.realestate.softwarevala.com', status: 'expired', lastUpdated: '7 days ago' },
  { id: '6', name: 'Gym Demo', product: 'Gym Management', domain: 'demo.gym.softwarevala.com', status: 'live', lastUpdated: '30 min ago' },
];

export const DemoManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'live' | 'expired'>('all');

  const filteredDemos = mockDemos.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.domain.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenDemo = (demo: typeof mockDemos[0]) => {
    toast.info(`Opening demo: ${demo.domain}`);
    window.open(`https://${demo.domain}`, '_blank');
  };

  const handleResetDemo = (demo: typeof mockDemos[0]) => {
    toast.success(`Demo "${demo.name}" reset successfully!`);
  };

  const handleExtendDemo = (demo: typeof mockDemos[0]) => {
    toast.success(`Demo "${demo.name}" extended by 30 days`);
  };

  const handleDeleteDemo = (demo: typeof mockDemos[0]) => {
    toast.warning(`Demo "${demo.name}" marked for deletion (soft delete)`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Monitor className="w-5 h-5 text-violet-400" />
          Demo Management
        </h1>
        <p className="text-sm text-muted-foreground">View and manage all product demos</p>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search demos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Button 
            variant={statusFilter === 'all' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setStatusFilter('all')}
          >
            All
          </Button>
          <Button 
            variant={statusFilter === 'live' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setStatusFilter('live')}
          >
            Live
          </Button>
          <Button 
            variant={statusFilter === 'expired' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setStatusFilter('expired')}
          >
            Expired
          </Button>
        </div>
      </div>

      {/* Demo Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredDemos.map((demo, idx) => (
          <motion.div
            key={demo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className={cn(
              "bg-card/80 border-border/50 hover:border-violet-500/30 transition-all",
              demo.status === 'expired' && "opacity-75"
            )}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{demo.name}</h3>
                    <p className="text-xs text-muted-foreground">{demo.product}</p>
                  </div>
                  <Badge variant={demo.status === 'live' ? 'default' : 'destructive'}>
                    {demo.status === 'live' ? '● Live' : '○ Expired'}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  <Globe className="w-3.5 h-3.5" />
                  <span className="truncate">{demo.domain}</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Updated {demo.lastUpdated}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="flex-1 gap-1.5 text-xs"
                    onClick={() => handleOpenDemo(demo)}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-1.5 text-xs"
                    onClick={() => handleResetDemo(demo)}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-1.5 text-xs"
                    onClick={() => handleExtendDemo(demo)}
                  >
                    <CalendarPlus className="w-3.5 h-3.5" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-1.5 text-xs text-destructive hover:text-destructive"
                    onClick={() => handleDeleteDemo(demo)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
