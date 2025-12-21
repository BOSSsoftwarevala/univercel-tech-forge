import React from 'react';
import { 
  Play, Filter, Search, Grid3X3, List, AlertTriangle, 
  CheckCircle, Clock, Globe, ExternalLink, Eye, Copy,
  Laptop, Database, ShoppingCart, GraduationCap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

const demoCategories = [
  { id: 'school', name: 'School ERP', icon: GraduationCap, count: 12 },
  { id: 'pos', name: 'POS Systems', icon: ShoppingCart, count: 8 },
  { id: 'hospital', name: 'Hospital CRM', icon: Database, count: 6 },
  { id: 'crm', name: 'Business CRM', icon: Laptop, count: 15 },
];

const mockDemos = [
  { id: 'D-001', name: 'School Pro ERP', category: 'school', stack: 'PHP/MySQL', status: 'active', uptime: 99.9, clicks: 1245 },
  { id: 'D-002', name: 'Smart POS', category: 'pos', stack: 'React/Node', status: 'active', uptime: 99.5, clicks: 892 },
  { id: 'D-003', name: 'Hospital Manager', category: 'hospital', stack: 'Java/Oracle', status: 'maintenance', uptime: 95.2, clicks: 456 },
  { id: 'D-004', name: 'Sales CRM Pro', category: 'crm', stack: 'Python/PostgreSQL', status: 'active', uptime: 99.8, clicks: 2341 },
  { id: 'D-005', name: 'Inventory Master', category: 'pos', stack: 'PHP/MySQL', status: 'down', uptime: 0, clicks: 123 },
  { id: 'D-006', name: 'Clinic Scheduler', category: 'hospital', stack: 'React/Firebase', status: 'active', uptime: 98.7, clicks: 678 },
];

export function DemoManagerScreen() {
  const isDark = true;

  const statusColors = {
    active: 'bg-emerald-500',
    maintenance: 'bg-amber-500',
    down: 'bg-red-500',
  };

  const statusIcons = {
    active: CheckCircle,
    maintenance: Clock,
    down: AlertTriangle,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Play className="h-6 w-6 text-violet-500" />
            Demo Manager
          </h1>
          <p className="text-muted-foreground">Manage all product demos</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            {mockDemos.filter(d => d.status === 'active').length} Active
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1 text-red-500 border-red-500">
            <AlertTriangle className="h-3 w-3" />
            {mockDemos.filter(d => d.status === 'down').length} Down
          </Badge>
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs defaultValue="all">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="all">All Demos</TabsTrigger>
          {demoCategories.map((cat) => (
            <TabsTrigger key={cat.id} value={cat.id} className="flex items-center gap-2">
              <cat.icon className="h-4 w-4" />
              {cat.name}
              <Badge variant="outline" className="text-[10px]">{cat.count}</Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="mt-4">
          {/* Search & Filters */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search demos..." className="pl-10" />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <div className="flex items-center gap-1 border rounded-lg p-1">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Demo Cards Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockDemos.map((demo) => {
              const StatusIcon = statusIcons[demo.status as keyof typeof statusIcons];
              return (
                <div key={demo.id} className={`p-4 rounded-xl border transition-all hover:shadow-lg ${
                  isDark ? 'bg-slate-800/50 border-slate-700 hover:border-violet-500/50' : 'bg-white border-gray-200'
                }`}>
                  {/* Status & ID */}
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="text-xs">{demo.id}</Badge>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                      demo.status === 'active' ? 'bg-emerald-500/20 text-emerald-500' :
                      demo.status === 'maintenance' ? 'bg-amber-500/20 text-amber-500' :
                      'bg-red-500/20 text-red-500'
                    }`}>
                      <StatusIcon className="h-3 w-3" />
                      {demo.status}
                    </div>
                  </div>

                  {/* Name & Category */}
                  <h3 className="font-semibold mb-1">{demo.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{demo.category}</p>

                  {/* Tech Stack Badge */}
                  <Badge variant="outline" className="mb-3 bg-violet-500/10 border-violet-500/30">
                    {demo.stack}
                  </Badge>

                  {/* Uptime & Clicks */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className={`p-2 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
                      <p className="text-xs text-muted-foreground">Uptime</p>
                      <p className={`font-semibold ${demo.uptime > 99 ? 'text-emerald-500' : demo.uptime > 95 ? 'text-amber-500' : 'text-red-500'}`}>
                        {demo.uptime}%
                      </p>
                    </div>
                    <div className={`p-2 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
                      <p className="text-xs text-muted-foreground">Clicks</p>
                      <p className="font-semibold">{demo.clicks.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Copy className="h-3 w-3 mr-1" />
                      Copy Link
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Alert Panel for Downtime */}
      <div className={`p-4 rounded-xl border ${isDark ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            <div>
              <h3 className="font-semibold text-red-500">Demo Down Alert</h3>
              <p className="text-sm text-muted-foreground">Inventory Master (D-005) is currently offline</p>
            </div>
          </div>
          <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-500/10">
            Investigate
          </Button>
        </div>
      </div>

      {/* Click Metrics Graph */}
      <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'}`}>
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Globe className="h-5 w-5 text-cyan-500" />
          Click Metrics (Last 7 Days)
        </h3>
        <div className={`h-48 rounded-lg flex items-center justify-center ${isDark ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
          <div className="text-center">
            <Globe className="h-12 w-12 mx-auto text-cyan-500 mb-2" />
            <p className="text-muted-foreground">Click distribution chart</p>
            <p className="text-sm text-cyan-500">8,234 total clicks</p>
          </div>
        </div>
      </div>
    </div>
  );
}
