import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  MonitorPlay,
  Plus,
  Search,
  RefreshCw,
  MoreVertical,
  Eye,
  Edit,
  Pause,
  Play,
  Power,
  Link2,
  Users,
  TrendingUp,
  Clock,
  Loader2,
  ExternalLink,
  Calendar,
} from 'lucide-react';

interface Demo {
  id: string;
  title: string;
  url: string;
  status: string;
  access_type?: string;
  created_at: string;
  product_mappings?: { product_id: string; products?: { product_name: string } }[];
}

const PMDemoManagement: React.FC = () => {
  const [demos, setDemos] = useState<Demo[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    access_type: 'public',
  });

  const fetchDemos = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('demos')
        .select('*')
        .order('created_at', { ascending: false });

      if (filterStatus !== 'all' && (filterStatus === 'active' || filterStatus === 'inactive' || filterStatus === 'down' || filterStatus === 'maintenance')) {
        query = query.eq('status', filterStatus);
      }
      if (search) query = query.ilike('title', `%${search}%`);

      const { data, error } = await query;
      if (error) throw error;
      setDemos((data || []).map(d => ({ ...d, title: d.title || d.url, url: d.url })));
    } catch (error: any) {
      toast.error('Failed to fetch demos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemos();
  }, [filterStatus, search]);

  const handleCreateDemo = async () => {
    if (!formData.title || !formData.url) {
      toast.error('Title and URL are required');
      return;
    }

    try {
      const { error } = await supabase.from('demos').insert([{
        title: formData.title,
        url: formData.url,
        status: 'active' as const,
        category: 'product_demo',
      }]);

      if (error) throw error;

      toast.success('Demo created successfully');
      setShowCreateDialog(false);
      setFormData({ title: '', url: '', access_type: 'public' });
      fetchDemos();
    } catch (error: any) {
      toast.error('Failed to create demo: ' + error.message);
    }
  };

  const handleToggleStatus = async (demo: Demo, newStatus: 'active' | 'inactive') => {
    try {
      const { error } = await supabase
        .from('demos')
        .update({ status: newStatus })
        .eq('id', demo.id);

      if (error) throw error;

      toast.success(`Demo ${newStatus === 'active' ? 'resumed' : 'paused'}`);
      fetchDemos();
    } catch (error: any) {
      toast.error('Failed to update demo status');
    }
  };

  const handleDisableDemo = async (demo: Demo) => {
    try {
      const { error } = await supabase
        .from('demos')
        .update({ status: 'inactive' as const })
        .eq('id', demo.id);

      if (error) throw error;

      toast.success('Demo disabled');
      fetchDemos();
    } catch (error: any) {
      toast.error('Failed to disable demo');
    }
  };

  const stats = {
    total: demos.length,
    active: demos.filter(d => d.status === 'active').length,
    paused: demos.filter(d => d.status === 'paused').length,
    avgConversion: 12.5,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MonitorPlay className="w-6 h-6 text-purple-500" />
            Demo Management
          </h1>
          <p className="text-muted-foreground text-sm">Create, assign, and track product demos</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Demo
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <MonitorPlay className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total Demos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Play className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.active}</p>
              <p className="text-xs text-muted-foreground">Active Demos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Pause className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.paused}</p>
              <p className="text-xs text-muted-foreground">Paused</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-cyan-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.avgConversion}%</p>
              <p className="text-xs text-muted-foreground">Avg Conversion</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search demos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={fetchDemos}>
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Demos Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : demos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <MonitorPlay className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">No Demos Found</h3>
              <p className="text-muted-foreground text-sm mb-4">Create your first demo to get started</p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Demo
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Demo</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Conversion</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {demos.map((demo) => (
                  <TableRow key={demo.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                          <MonitorPlay className="w-5 h-5 text-purple-500" />
                        </div>
                        <div>
                          <p className="font-medium">{demo.title}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(demo.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <a
                        href={demo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        {demo.url.substring(0, 30)}...
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </TableCell>
                    <TableCell>
                      <Badge variant={demo.status === 'active' ? 'default' : demo.status === 'paused' ? 'secondary' : 'destructive'}>
                        {demo.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{Math.floor(Math.random() * 100)} users</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={Math.random() * 25} className="w-16 h-2" />
                        <span className="text-sm">{(Math.random() * 25).toFixed(1)}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Link2 className="w-4 h-4 mr-2" />
                              Assign to Product
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {demo.status === 'active' ? (
                              <DropdownMenuItem onClick={() => handleToggleStatus(demo, 'inactive')}>
                                <Pause className="w-4 h-4 mr-2" />
                                Pause
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handleToggleStatus(demo, 'active')}>
                                <Play className="w-4 h-4 mr-2" />
                                Resume
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleDisableDemo(demo)}>
                              <Power className="w-4 h-4 mr-2" />
                              Disable
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Demo Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Demo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Demo Title *</label>
              <Input
                placeholder="Enter demo title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Demo URL *</label>
              <Input
                placeholder="https://demo.example.com"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Access Type</label>
              <Select
                value={formData.access_type}
                onValueChange={(v) => setFormData({ ...formData, access_type: v })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="password">Password Protected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
            <Button onClick={handleCreateDemo}>Create Demo</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PMDemoManagement;
