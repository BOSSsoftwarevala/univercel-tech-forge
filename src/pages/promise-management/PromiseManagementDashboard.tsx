/**
 * Promise Management Dashboard
 * Role 28 - Full promise lifecycle management
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, ListTodo, Users, Shield, BarChart3, Settings,
  CheckCircle, Clock, AlertTriangle, XCircle, TrendingUp, Target,
  Search, Filter, RefreshCw, Plus, Eye, Edit, MoreVertical
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PromiseTask {
  id: string;
  title: string;
  developer_name: string;
  developer_id: string;
  status: 'assigned' | 'promised' | 'in_progress' | 'completed' | 'breached';
  deadline: string;
  promised_at?: string;
  created_at: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  client_name: string;
}

const mockPromises: PromiseTask[] = [
  { id: '1', title: 'E-commerce Module Integration', developer_name: 'Dev-7X9K', developer_id: 'dev1', status: 'in_progress', deadline: '2024-12-28', promised_at: '2024-12-20', created_at: '2024-12-18', priority: 'high', client_name: 'ABC Corp' },
  { id: '2', title: 'Payment Gateway Setup', developer_name: 'Dev-3A2B', developer_id: 'dev2', status: 'promised', deadline: '2024-12-30', promised_at: '2024-12-22', created_at: '2024-12-19', priority: 'critical', client_name: 'XYZ Ltd' },
  { id: '3', title: 'Dashboard Analytics', developer_name: 'Dev-9C4D', developer_id: 'dev3', status: 'completed', deadline: '2024-12-25', promised_at: '2024-12-15', created_at: '2024-12-10', priority: 'medium', client_name: 'Tech Solutions' },
  { id: '4', title: 'Mobile App API', developer_name: 'Dev-5E6F', developer_id: 'dev4', status: 'breached', deadline: '2024-12-20', promised_at: '2024-12-12', created_at: '2024-12-08', priority: 'high', client_name: 'StartUp Inc' },
  { id: '5', title: 'User Authentication', developer_name: 'Dev-7X9K', developer_id: 'dev1', status: 'assigned', deadline: '2025-01-05', created_at: '2024-12-22', priority: 'medium', client_name: 'Global Services' },
];

const statusConfig = {
  assigned: { label: 'Assigned', color: 'bg-slate-500', icon: Clock },
  promised: { label: 'Promised', color: 'bg-amber-500', icon: Target },
  in_progress: { label: 'In Progress', color: 'bg-blue-500', icon: TrendingUp },
  completed: { label: 'Completed', color: 'bg-green-500', icon: CheckCircle },
  breached: { label: 'Breached', color: 'bg-red-500', icon: XCircle },
};

const priorityConfig = {
  low: { label: 'Low', color: 'bg-slate-400' },
  medium: { label: 'Medium', color: 'bg-blue-400' },
  high: { label: 'High', color: 'bg-orange-400' },
  critical: { label: 'Critical', color: 'bg-red-500' },
};

export default function PromiseManagementDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [promises, setPromises] = useState<PromiseTask[]>(mockPromises);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Stats calculation
  const stats = {
    total: promises.length,
    active: promises.filter(p => ['promised', 'in_progress'].includes(p.status)).length,
    completed: promises.filter(p => p.status === 'completed').length,
    breached: promises.filter(p => p.status === 'breached').length,
    pending: promises.filter(p => p.status === 'assigned').length,
    fulfillmentRate: Math.round((promises.filter(p => p.status === 'completed').length / Math.max(promises.filter(p => ['completed', 'breached'].includes(p.status)).length, 1)) * 100),
  };

  const filteredPromises = promises.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.developer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Data refreshed');
    }, 1000);
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Promise Management</h1>
            <p className="text-muted-foreground">Monitor and manage all developer promises across the platform</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New Assignment
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <ListTodo className="w-8 h-8 text-primary" />
                <span className="text-2xl font-bold">{stats.total}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Total Promises</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <TrendingUp className="w-8 h-8 text-blue-500" />
                <span className="text-2xl font-bold">{stats.active}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Active</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <CheckCircle className="w-8 h-8 text-green-500" />
                <span className="text-2xl font-bold">{stats.completed}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Completed</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <XCircle className="w-8 h-8 text-red-500" />
                <span className="text-2xl font-bold">{stats.breached}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Breached</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Clock className="w-8 h-8 text-amber-500" />
                <span className="text-2xl font-bold">{stats.pending}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Pending</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Target className="w-8 h-8 text-purple-500" />
                <span className="text-2xl font-bold">{stats.fulfillmentRate}%</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Fulfillment Rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-secondary/50">
            <TabsTrigger value="overview" className="gap-2">
              <LayoutDashboard className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="promises" className="gap-2">
              <ListTodo className="w-4 h-4" />
              All Promises
            </TabsTrigger>
            <TabsTrigger value="developers" className="gap-2">
              <Users className="w-4 h-4" />
              Developers
            </TabsTrigger>
            <TabsTrigger value="approvals" className="gap-2">
              <Shield className="w-4 h-4" />
              Approvals
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Promises */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Promises</CardTitle>
                  <CardDescription>Latest promise activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-3">
                      {promises.slice(0, 5).map((promise) => {
                        const StatusIcon = statusConfig[promise.status].icon;
                        return (
                          <motion.div
                            key={promise.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full ${statusConfig[promise.status].color} flex items-center justify-center`}>
                                <StatusIcon className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">{promise.title}</p>
                                <p className="text-xs text-muted-foreground">{promise.developer_name} • {promise.client_name}</p>
                              </div>
                            </div>
                            <Badge variant="outline" className={priorityConfig[promise.priority].color + ' text-white border-0'}>
                              {promise.priority}
                            </Badge>
                          </motion.div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Fulfillment Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Fulfillment Progress</CardTitle>
                  <CardDescription>Promise completion metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Overall Fulfillment</span>
                      <span className="font-medium">{stats.fulfillmentRate}%</span>
                    </div>
                    <Progress value={stats.fulfillmentRate} className="h-3" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                      <p className="text-2xl font-bold text-green-500">{stats.completed}</p>
                      <p className="text-sm text-muted-foreground">On-time Delivery</p>
                    </div>
                    <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                      <p className="text-2xl font-bold text-red-500">{stats.breached}</p>
                      <p className="text-sm text-muted-foreground">Breached</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Status Distribution</p>
                    <div className="flex gap-1 h-4 rounded-full overflow-hidden">
                      {Object.entries(statusConfig).map(([status, config]) => {
                        const count = promises.filter(p => p.status === status).length;
                        const percentage = (count / promises.length) * 100;
                        return (
                          <div
                            key={status}
                            className={`${config.color} transition-all`}
                            style={{ width: `${percentage}%` }}
                            title={`${config.label}: ${count}`}
                          />
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="promises" className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search promises, developers, clients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                {['all', 'assigned', 'promised', 'in_progress', 'completed', 'breached'].map((status) => (
                  <Button
                    key={status}
                    variant={filterStatus === status ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterStatus(status)}
                    className="capitalize"
                  >
                    {status === 'all' ? 'All' : status.replace('_', ' ')}
                  </Button>
                ))}
              </div>
            </div>

            {/* Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead>Developer</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Deadline</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPromises.map((promise) => {
                      const StatusIcon = statusConfig[promise.status].icon;
                      return (
                        <TableRow key={promise.id}>
                          <TableCell className="font-medium">{promise.title}</TableCell>
                          <TableCell>{promise.developer_name}</TableCell>
                          <TableCell>{promise.client_name}</TableCell>
                          <TableCell>
                            <Badge className={`${statusConfig[promise.status].color} text-white border-0 gap-1`}>
                              <StatusIcon className="w-3 h-3" />
                              {statusConfig[promise.status].label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`${priorityConfig[promise.priority].color} text-white border-0`}>
                              {promise.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(promise.deadline).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="developers">
            <Card>
              <CardHeader>
                <CardTitle>Developer Performance</CardTitle>
                <CardDescription>Track developer promise fulfillment rates</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Developer performance metrics and rankings will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approvals">
            <Card>
              <CardHeader>
                <CardTitle>Pending Approvals</CardTitle>
                <CardDescription>Review and approve promise extensions and modifications</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">No pending approvals at this time.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Promise Analytics</CardTitle>
                <CardDescription>Detailed analytics and reporting</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Analytics dashboard with charts and insights will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
