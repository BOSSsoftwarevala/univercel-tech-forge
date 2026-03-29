import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Plus, Edit2, Trash2, ExternalLink, Save, X, 
  Star, Eye, EyeOff, RefreshCw, Search, Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface DemoProject {
  id: string;
  project_name: string;
  project_url: string;
  description: string;
  category: string;
  thumbnail_url: string;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
  tech_stack: string[];
  created_at: string;
}

interface DemoRequest {
  id: string;
  client_name: string;
  client_email: string;
  company_name: string;
  phone: string;
  interested_category: string;
  message: string;
  status: string;
  notes: string;
  created_at: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  is_active: boolean;
}

const DemoManager = () => {
  const [projects, setProjects] = useState<DemoProject[]>([]);
  const [requests, setRequests] = useState<DemoRequest[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<DemoProject | null>(null);
  const [formData, setFormData] = useState({
    project_name: '',
    project_url: '',
    description: '',
    category: '',
    thumbnail_url: '',
    is_featured: false,
    is_active: true,
    display_order: 0,
    tech_stack: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [projRes, reqRes, catRes] = await Promise.all([
        supabase.from('demo_projects').select('*').order('display_order'),
        supabase.from('demo_requests').select('*').order('created_at', { ascending: false }),
        supabase.from('demo_categories').select('*').order('display_order'),
      ]);

      if (projRes.data) setProjects(projRes.data);
      if (reqRes.data) setRequests(reqRes.data);
      if (catRes.data) setCategories(catRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openAddDialog = () => {
    setEditingProject(null);
    setFormData({
      project_name: '',
      project_url: '',
      description: '',
      category: '',
      thumbnail_url: '',
      is_featured: false,
      is_active: true,
      display_order: projects.length,
      tech_stack: '',
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (project: DemoProject) => {
    setEditingProject(project);
    setFormData({
      project_name: project.project_name,
      project_url: project.project_url,
      description: project.description || '',
      category: project.category,
      thumbnail_url: project.thumbnail_url || '',
      is_featured: project.is_featured,
      is_active: project.is_active,
      display_order: project.display_order,
      tech_stack: project.tech_stack?.join(', ') || '',
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.project_name || !formData.project_url || !formData.category) {
      toast.error('Please fill required fields');
      return;
    }

    const techStackArray = formData.tech_stack
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const projectData = {
      project_name: formData.project_name,
      project_url: formData.project_url,
      description: formData.description,
      category: formData.category,
      thumbnail_url: formData.thumbnail_url,
      is_featured: formData.is_featured,
      is_active: formData.is_active,
      display_order: formData.display_order,
      tech_stack: techStackArray,
    };

    try {
      if (editingProject) {
        const { error } = await supabase
          .from('demo_projects')
          .update(projectData)
          .eq('id', editingProject.id);
        if (error) throw error;
        toast.success('Demo updated successfully');
      } else {
        const { error } = await supabase.from('demo_projects').insert(projectData);
        if (error) throw error;
        toast.success('Demo added successfully');
      }
      setIsDialogOpen(false);
      fetchData();
    } catch (error) {
      toast.error('Failed to save demo');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this demo?')) return;
    
    try {
      const { error } = await supabase.from('demo_projects').delete().eq('id', id);
      if (error) throw error;
      toast.success('Demo deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete demo');
    }
  };

  const toggleActive = async (id: string, currentState: boolean) => {
    try {
      const { error } = await supabase
        .from('demo_projects')
        .update({ is_active: !currentState })
        .eq('id', id);
      if (error) throw error;
      toast.success(currentState ? 'Demo hidden' : 'Demo visible');
      fetchData();
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  const updateRequestStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('demo_requests')
        .update({ status, responded_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
      toast.success(`Request marked as ${status}`);
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Demo Manager</h1>
          <p className="text-gray-400">Manage your project demos</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchData} className="border-gray-700">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={openAddDialog} className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Demo
          </Button>
        </div>
      </div>

      <Tabs defaultValue="demos" className="space-y-4">
        <TabsList className="bg-gray-800">
          <TabsTrigger value="demos">Demos ({projects.length})</TabsTrigger>
          <TabsTrigger value="requests">Requests ({requests.filter(r => r.status === 'pending').length} pending)</TabsTrigger>
        </TabsList>

        <TabsContent value="demos" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <Card key={project.id} className={`bg-gray-800/50 border-gray-700 ${!project.is_active && 'opacity-50'}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-white text-lg flex items-center gap-2">
                        {project.project_name}
                        {project.is_featured && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />}
                      </CardTitle>
                      <Badge variant="outline" className="mt-1 text-xs border-gray-600">
                        {project.category}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => toggleActive(project.id, project.is_active)}>
                        {project.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => openEditDialog(project)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="text-red-400" onClick={() => handleDelete(project.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400 mb-3 line-clamp-2">{project.description || 'No description'}</p>
                  <Button size="sm" variant="outline" className="w-full border-gray-600" onClick={() => window.open(project.project_url, '_blank')}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open Demo
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="requests">
          <Card className="bg-gray-800/50 border-gray-700">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-400">Client</TableHead>
                  <TableHead className="text-gray-400">Company</TableHead>
                  <TableHead className="text-gray-400">Category</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-gray-400">Date</TableHead>
                  <TableHead className="text-gray-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((req) => (
                  <TableRow key={req.id} className="border-gray-700">
                    <TableCell>
                      <div>
                        <p className="text-white font-medium">{req.client_name}</p>
                        <p className="text-sm text-gray-400">{req.client_email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">{req.company_name || '-'}</TableCell>
                    <TableCell className="text-gray-300">{req.interested_category || '-'}</TableCell>
                    <TableCell>
                      <Badge className={
                        req.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        req.status === 'contacted' ? 'bg-blue-500/20 text-blue-400' :
                        req.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                        'bg-gray-500/20 text-gray-400'
                      }>
                        {req.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-400">
                      {new Date(req.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Select onValueChange={(val) => updateRequestStatus(req.id, val)}>
                        <SelectTrigger className="w-32 bg-gray-700 border-gray-600">
                          <SelectValue placeholder="Update" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
                {requests.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-400 py-8">
                      No demo requests yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingProject ? 'Edit Demo' : 'Add New Demo'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <Label>Project Name *</Label>
              <Input
                value={formData.project_name}
                onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                placeholder="My Awesome App"
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div>
              <Label>Demo URL *</Label>
              <Input
                value={formData.project_url}
                onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
                placeholder="https://your-app.example.com"
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div>
              <Label>Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(val) => setFormData({ ...formData, category: val })}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the project..."
                className="bg-gray-800 border-gray-700"
                rows={3}
              />
            </div>
            <div>
              <Label>Thumbnail URL</Label>
              <Input
                value={formData.thumbnail_url}
                onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                placeholder="https://..."
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div>
              <Label>Tech Stack (comma-separated)</Label>
              <Input
                value={formData.tech_stack}
                onChange={(e) => setFormData({ ...formData, tech_stack: e.target.value })}
                placeholder="React, TypeScript, Supabase"
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_featured}
                  onCheckedChange={(val) => setFormData({ ...formData, is_featured: val })}
                />
                <Label>Featured</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(val) => setFormData({ ...formData, is_active: val })}
                />
                <Label>Active</Label>
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSave} className="flex-1 bg-purple-600 hover:bg-purple-700">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DemoManager;
