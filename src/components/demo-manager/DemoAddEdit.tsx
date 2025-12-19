import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Monitor, 
  Link, 
  Code, 
  Shield,
  Clock,
  Users,
  Search,
  MoreVertical,
  ExternalLink
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Demo {
  id: string;
  title: string;
  category: string;
  url: string;
  maskedUrl: string;
  techStack: string;
  status: string;
  multiLogin: boolean;
  maxLogins: number;
  healthInterval: number;
  backupUrl: string;
  description: string;
}

const DemoAddEdit = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDemo, setEditingDemo] = useState<Demo | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    url: "",
    techStack: "react",
    description: "",
    multiLogin: false,
    maxLogins: 1,
    healthInterval: 5,
    backupUrl: "",
  });

  const demos: Demo[] = [
    { id: "1", title: "CRM Enterprise", category: "Business", url: "https://demo.crm.com", maskedUrl: "demo-crm-****", techStack: "react", status: "active", multiLogin: true, maxLogins: 5, healthInterval: 5, backupUrl: "https://backup.crm.com", description: "Enterprise CRM solution" },
    { id: "2", title: "E-Commerce Suite", category: "Retail", url: "https://demo.ecom.com", maskedUrl: "demo-ecom-****", techStack: "node", status: "active", multiLogin: true, maxLogins: 3, healthInterval: 3, backupUrl: "", description: "Full e-commerce platform" },
    { id: "3", title: "HR Management", category: "HR", url: "https://demo.hr.com", maskedUrl: "demo-hr-****", techStack: "php", status: "maintenance", multiLogin: false, maxLogins: 1, healthInterval: 10, backupUrl: "", description: "HR management system" },
    { id: "4", title: "Inventory System", category: "Logistics", url: "https://demo.inv.com", maskedUrl: "demo-inv-****", techStack: "java", status: "active", multiLogin: true, maxLogins: 2, healthInterval: 5, backupUrl: "https://backup.inv.com", description: "Inventory tracking solution" },
    { id: "5", title: "Finance Portal", category: "Finance", url: "https://demo.fin.com", maskedUrl: "demo-fin-****", techStack: "python", status: "down", multiLogin: false, maxLogins: 1, healthInterval: 2, backupUrl: "https://backup.fin.com", description: "Financial management portal" },
  ];

  const techStacks = [
    { value: "php", label: "PHP", color: "bg-indigo-500/20 text-indigo-400" },
    { value: "node", label: "Node.js", color: "bg-green-500/20 text-green-400" },
    { value: "java", label: "Java", color: "bg-orange-500/20 text-orange-400" },
    { value: "python", label: "Python", color: "bg-yellow-500/20 text-yellow-400" },
    { value: "react", label: "React", color: "bg-cyan-500/20 text-cyan-400" },
    { value: "angular", label: "Angular", color: "bg-red-500/20 text-red-400" },
    { value: "vue", label: "Vue.js", color: "bg-emerald-500/20 text-emerald-400" },
    { value: "other", label: "Other", color: "bg-gray-500/20 text-gray-400" },
  ];

  const categories = ["Business", "Retail", "HR", "Logistics", "Finance", "Healthcare", "Education", "Real Estate"];

  const getTechBadge = (tech: string) => {
    const found = techStacks.find(t => t.value === tech);
    return found ? found.color : "bg-gray-500/20 text-gray-400";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active": return "bg-neon-green/20 text-neon-green border-neon-green/30";
      case "maintenance": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "down": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.url || !formData.category) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: editingDemo ? "Demo Updated Successfully" : "Demo Added Successfully",
      description: `${formData.title} has been ${editingDemo ? "updated" : "added"} to the system.`,
    });
    
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (demo: Demo) => {
    toast({
      title: "Demo Removed",
      description: `${demo.title} has been removed from the system.`,
    });
  };

  const handleEdit = (demo: Demo) => {
    setEditingDemo(demo);
    setFormData({
      title: demo.title,
      category: demo.category,
      url: demo.url,
      techStack: demo.techStack,
      description: demo.description,
      multiLogin: demo.multiLogin,
      maxLogins: demo.maxLogins,
      healthInterval: demo.healthInterval,
      backupUrl: demo.backupUrl,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      url: "",
      techStack: "react",
      description: "",
      multiLogin: false,
      maxLogins: 1,
      healthInterval: 5,
      backupUrl: "",
    });
    setEditingDemo(null);
  };

  const filteredDemos = demos.filter(demo =>
    demo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    demo.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Demo Management</h1>
          <p className="text-muted-foreground">Add, edit, and manage demo configurations</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add New Demo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-card border-border">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {editingDemo ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                {editingDemo ? "Edit Demo" : "Add New Demo"}
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Demo Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter demo title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="url">Demo URL *</Label>
                <div className="relative">
                  <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="url"
                    placeholder="https://demo.example.com"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="bg-background border-border pl-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="techStack">Tech Stack</Label>
                  <Select value={formData.techStack} onValueChange={(v) => setFormData({ ...formData, techStack: v })}>
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue placeholder="Select tech stack" />
                    </SelectTrigger>
                    <SelectContent>
                      {techStacks.map(tech => (
                        <SelectItem key={tech.value} value={tech.value}>
                          <div className="flex items-center gap-2">
                            <Code className="w-3 h-3" />
                            {tech.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="healthInterval">Health Check Interval (min)</Label>
                  <Input
                    id="healthInterval"
                    type="number"
                    min={1}
                    max={60}
                    value={formData.healthInterval}
                    onChange={(e) => setFormData({ ...formData, healthInterval: parseInt(e.target.value) || 5 })}
                    className="bg-background border-border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="backupUrl">Backup URL</Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="backupUrl"
                    placeholder="https://backup.example.com"
                    value={formData.backupUrl}
                    onChange={(e) => setFormData({ ...formData, backupUrl: e.target.value })}
                    className="bg-background border-border pl-10"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Multi-Login Support</p>
                    <p className="text-xs text-muted-foreground">Allow multiple concurrent sessions</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={formData.multiLogin}
                    onCheckedChange={(checked) => setFormData({ ...formData, multiLogin: checked })}
                  />
                  {formData.multiLogin && (
                    <Input
                      type="number"
                      min={1}
                      max={10}
                      value={formData.maxLogins}
                      onChange={(e) => setFormData({ ...formData, maxLogins: parseInt(e.target.value) || 1 })}
                      className="w-16 bg-background border-border"
                    />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter demo description..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-background border-border min-h-[80px]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90">
                  {editingDemo ? "Update Demo" : "Add Demo"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search demos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-background/50 border-border"
        />
      </div>

      {/* Demo List */}
      <div className="grid gap-4">
        {filteredDemos.map((demo, index) => (
          <motion.div
            key={demo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-card border-border/50 hover:border-primary/50 transition-all">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Monitor className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{demo.title}</h3>
                        <Badge className={getStatusBadge(demo.status)}>{demo.status}</Badge>
                        <Badge className={getTechBadge(demo.techStack)}>{demo.techStack.toUpperCase()}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{demo.category} • {demo.description}</p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Link className="w-3 h-3" />
                          {demo.maskedUrl}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {demo.healthInterval}min interval
                        </span>
                        {demo.multiLogin && (
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {demo.maxLogins} logins
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="border-border">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="border-border">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(demo)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Demo
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(demo)}
                          className="text-red-400 focus:text-red-400"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove Demo
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DemoAddEdit;
