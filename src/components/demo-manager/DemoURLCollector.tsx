import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Link2, 
  Plus, 
  Trash2, 
  Save,
  Loader2,
  ExternalLink,
  RefreshCw,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Edit3,
  X,
  Globe,
  Layers,
  User,
  Lock,
  Copy,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface LoginRole {
  id: string;
  roleName: string;
  username: string;
  password: string;
  showPassword: boolean;
}

interface FetchedDemoData {
  url: string;
  title: string;
  description: string;
  source: string;
  demoType: string;
  category: string;
}

interface RegisteredDemo {
  id: string;
  title: string;
  url: string;
  category: string;
  demo_type: string;
  status: string;
  lifecycle_status: string | null;
  created_at: string;
  login_count: number;
}

const DEMO_TYPES = ["Admin Panel", "Dashboard", "Frontend", "Backend", "Full Stack", "API", "Mobile App"];
const CATEGORIES = [
  "Education", "Healthcare", "E-Commerce", "POS/Billing", "CRM", "HRM", 
  "Hotel/Booking", "Restaurant", "Real Estate", "ERP", "General", "Finance",
  "Logistics", "Social Media", "Entertainment", "Travel", "Fitness", "News/Blog"
];
const SOURCES = ["Codecanyon", "Envato", "ThemeForest", "GitHub", "Demo Site", "Preview Site", "Custom"];

const DemoURLCollector = () => {
  // Form state
  const [demoUrl, setDemoUrl] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [fetchedData, setFetchedData] = useState<FetchedDemoData | null>(null);
  
  // Editable fields
  const [demoName, setDemoName] = useState("");
  const [demoDescription, setDemoDescription] = useState("");
  const [sector, setSector] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [demoType, setDemoType] = useState("");
  const [source, setSource] = useState("");
  
  // Login roles
  const [loginRoles, setLoginRoles] = useState<LoginRole[]>([]);
  
  // Registered demos list
  const [registeredDemos, setRegisteredDemos] = useState<RegisteredDemo[]>([]);
  const [isLoadingDemos, setIsLoadingDemos] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Edit dialog
  const [editingDemo, setEditingDemo] = useState<RegisteredDemo | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  // Fetch registered demos on mount
  useEffect(() => {
    fetchRegisteredDemos();
  }, []);

  const fetchRegisteredDemos = async () => {
    setIsLoadingDemos(true);
    try {
      const { data: demos, error } = await supabase
        .from('demos')
        .select(`
          id,
          title,
          url,
          category,
          demo_type,
          status,
          lifecycle_status,
          created_at,
          demo_login_credentials(id)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedDemos: RegisteredDemo[] = (demos || []).map((demo: any) => ({
        id: demo.id,
        title: demo.title,
        url: demo.url,
        category: demo.category,
        demo_type: demo.demo_type || 'Full Stack',
        status: demo.status,
        lifecycle_status: demo.lifecycle_status,
        created_at: demo.created_at,
        login_count: demo.demo_login_credentials?.length || 0
      }));

      setRegisteredDemos(formattedDemos);
    } catch (error) {
      console.error('Error fetching demos:', error);
      toast({
        title: "Error",
        description: "Failed to load registered demos",
        variant: "destructive"
      });
    } finally {
      setIsLoadingDemos(false);
    }
  };

  const fetchDemoDetails = async () => {
    if (!demoUrl.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a demo URL to fetch details",
        variant: "destructive"
      });
      return;
    }

    setIsFetching(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-demo-url', {
        body: { url: demoUrl }
      });

      if (error) throw error;

      if (data.success) {
        const fetched = data.data as FetchedDemoData;
        setFetchedData(fetched);
        setDemoName(fetched.title);
        setDemoDescription(fetched.description);
        setSector(fetched.category);
        setDemoType(fetched.demoType);
        setSource(fetched.source);
        
        toast({
          title: "Details Fetched",
          description: "Demo details have been auto-detected. You can edit them if needed.",
        });
      } else {
        toast({
          title: "Fetch Failed",
          description: data.error || "Could not fetch demo details. Please fill manually.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error fetching demo details:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect. Please fill details manually.",
        variant: "destructive"
      });
    } finally {
      setIsFetching(false);
    }
  };

  const addLoginRole = () => {
    const newRole: LoginRole = {
      id: crypto.randomUUID(),
      roleName: "",
      username: "",
      password: "",
      showPassword: false
    };
    setLoginRoles([...loginRoles, newRole]);
  };

  const updateLoginRole = (id: string, field: keyof LoginRole, value: string | boolean) => {
    setLoginRoles(loginRoles.map(role => 
      role.id === id ? { ...role, [field]: value } : role
    ));
  };

  const removeLoginRole = (id: string) => {
    setLoginRoles(loginRoles.filter(role => role.id !== id));
  };

  const togglePasswordVisibility = (id: string) => {
    setLoginRoles(loginRoles.map(role => 
      role.id === id ? { ...role, showPassword: !role.showPassword } : role
    ));
  };

  const resetForm = () => {
    setDemoUrl("");
    setFetchedData(null);
    setDemoName("");
    setDemoDescription("");
    setSector("");
    setSubCategory("");
    setDemoType("");
    setSource("");
    setLoginRoles([]);
  };

  const handleSubmit = async () => {
    // Validation
    if (!demoUrl.trim()) {
      toast({ title: "Error", description: "Demo URL is required", variant: "destructive" });
      return;
    }
    if (!demoName.trim()) {
      toast({ title: "Error", description: "Demo name is required", variant: "destructive" });
      return;
    }
    if (!sector) {
      toast({ title: "Error", description: "Sector/Category is required", variant: "destructive" });
      return;
    }

    // Validate login roles if any
    for (const role of loginRoles) {
      if (!role.roleName.trim() || !role.username.trim() || !role.password.trim()) {
        toast({ 
          title: "Error", 
          description: "All login role fields must be filled", 
          variant: "destructive" 
        });
        return;
      }
    }

    setIsSubmitting(true);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ title: "Error", description: "You must be logged in", variant: "destructive" });
        return;
      }

      // Insert demo in PENDING status (using 'inactive' as pending state since enum doesn't have 'pending')
      const { data: newDemo, error: demoError } = await supabase
        .from('demos')
        .insert([{
          title: demoName,
          url: demoUrl,
          category: sector,
          description: demoDescription || null,
          demo_type: demoType || 'Full Stack',
          status: 'inactive' as const,
          lifecycle_status: 'pending_activation',
          created_by: user.id,
          total_login_roles: loginRoles.length,
          tech_stack: 'php' as const
        }])
        .select()
        .single();

      if (demoError) throw demoError;

      // Insert login credentials if any
      if (loginRoles.length > 0) {
        const credentialsToInsert = loginRoles.map(role => ({
          demo_id: newDemo.id,
          role_type: role.roleName,
          username: role.username,
          password: role.password,
          is_active: true
        }));

        const { error: credError } = await supabase
          .from('demo_login_credentials')
          .insert(credentialsToInsert);

        if (credError) {
          console.error('Error inserting credentials:', credError);
          // Don't throw - demo was created successfully
        }
      }

      // Log the action
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        module: 'demo_manager',
        action: 'demo_registered',
        meta_json: {
          demo_id: newDemo.id,
          demo_name: demoName,
          url: demoUrl,
          sector,
          login_roles: loginRoles.length
        }
      });

      toast({
        title: "Demo Registered",
        description: `"${demoName}" has been registered in PENDING state. Activate it when ready.`,
      });

      resetForm();
      fetchRegisteredDemos();

    } catch (error: any) {
      console.error('Error registering demo:', error);
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to register demo",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const activateDemo = async (demoId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('demos')
        .update({ 
          status: 'active',
          lifecycle_status: 'active',
          activated_at: new Date().toISOString(),
          activated_by: user?.id
        })
        .eq('id', demoId);

      if (error) throw error;

      toast({ title: "Success", description: "Demo activated successfully" });
      fetchRegisteredDemos();
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to activate demo", 
        variant: "destructive" 
      });
    }
  };

  const deleteDemo = async (demoId: string) => {
    if (!confirm("Are you sure you want to delete this demo? This action cannot be undone.")) {
      return;
    }

    try {
      // Delete credentials first
      await supabase
        .from('demo_login_credentials')
        .delete()
        .eq('demo_id', demoId);

      // Delete demo
      const { error } = await supabase
        .from('demos')
        .delete()
        .eq('id', demoId);

      if (error) throw error;

      toast({ title: "Deleted", description: "Demo has been removed" });
      fetchRegisteredDemos();
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to delete demo", 
        variant: "destructive" 
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: "URL copied to clipboard" });
  };

  const filteredDemos = registeredDemos.filter(demo =>
    demo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    demo.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
    demo.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-neon-green/20 text-neon-green border-neon-green/50';
      case 'inactive': return 'bg-neon-orange/20 text-neon-orange border-neon-orange/50';
      case 'down': return 'bg-destructive/20 text-destructive border-destructive/50';
      case 'maintenance': return 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/50';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status: string, lifecycle: string | null) => {
    if (lifecycle === 'pending_activation') return 'Pending';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-mono font-bold text-foreground">Demo URL Collection</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Paste any demo URL worldwide, auto-detect details, add login credentials, and register
          </p>
        </div>
        <Badge className="bg-neon-teal/20 text-neon-teal border-neon-teal/50">
          <Globe className="w-3 h-3 mr-1" />
          Universal Intake
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: URL Input & Registration Form */}
        <Card className="glass-panel border-border/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Link2 className="w-5 h-5 text-primary" />
              Register New Demo
            </CardTitle>
            <CardDescription>
              Paste any demo URL and we'll auto-detect the details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* URL Input */}
            <div className="space-y-2">
              <Label>Demo URL *</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="https://codecanyon.net/item/demo-preview..."
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  className="flex-1 bg-secondary/50"
                />
                <Button 
                  onClick={fetchDemoDetails}
                  disabled={isFetching || !demoUrl.trim()}
                  className="command-button-secondary"
                >
                  {isFetching ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  <span className="ml-2">Fetch</span>
                </Button>
              </div>
              {fetchedData && (
                <p className="text-xs text-neon-green flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Auto-detected from {fetchedData.source}
                </p>
              )}
            </div>

            <Separator />

            {/* Editable Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label>Demo Name *</Label>
                <Input
                  placeholder="E-Commerce Pro Dashboard"
                  value={demoName}
                  onChange={(e) => setDemoName(e.target.value)}
                  className="bg-secondary/50"
                />
              </div>

              <div className="space-y-2">
                <Label>Sector / Category *</Label>
                <Select value={sector} onValueChange={setSector}>
                  <SelectTrigger className="bg-secondary/50">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Sub-Category</Label>
                <Input
                  placeholder="e.g., Multi-vendor, SaaS"
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  className="bg-secondary/50"
                />
              </div>

              <div className="space-y-2">
                <Label>Demo Type</Label>
                <Select value={demoType} onValueChange={setDemoType}>
                  <SelectTrigger className="bg-secondary/50">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEMO_TYPES.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Source</Label>
                <Select value={source} onValueChange={setSource}>
                  <SelectTrigger className="bg-secondary/50">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    {SOURCES.map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2 space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Brief description of the demo..."
                  value={demoDescription}
                  onChange={(e) => setDemoDescription(e.target.value)}
                  className="bg-secondary/50 min-h-[80px]"
                />
              </div>
            </div>

            <Separator />

            {/* Login Roles Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Login Credentials</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Add login roles for this demo (optional)
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={addLoginRole}
                  className="border-primary/50 text-primary hover:bg-primary/10"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Role
                </Button>
              </div>

              <AnimatePresence>
                {loginRoles.map((role, index) => (
                  <motion.div
                    key={role.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 rounded-lg bg-secondary/30 border border-border/50 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-primary">
                        Role #{index + 1}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => removeLoginRole(role.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Role Name</Label>
                        <div className="relative">
                          <User className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                          <Input
                            placeholder="Admin"
                            value={role.roleName}
                            onChange={(e) => updateLoginRole(role.id, 'roleName', e.target.value)}
                            className="pl-7 h-9 text-sm bg-background/50"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Username</Label>
                        <Input
                          placeholder="admin@demo.com"
                          value={role.username}
                          onChange={(e) => updateLoginRole(role.id, 'username', e.target.value)}
                          className="h-9 text-sm bg-background/50"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                          <Input
                            type={role.showPassword ? "text" : "password"}
                            placeholder="••••••"
                            value={role.password}
                            onChange={(e) => updateLoginRole(role.id, 'password', e.target.value)}
                            className="pl-7 pr-8 h-9 text-sm bg-background/50"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-9 w-8"
                            onClick={() => togglePasswordVisibility(role.id)}
                          >
                            {role.showPassword ? (
                              <EyeOff className="w-3 h-3" />
                            ) : (
                              <Eye className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {loginRoles.length === 0 && (
                <div className="text-center py-6 text-muted-foreground text-sm">
                  <Lock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No login roles added yet</p>
                  <p className="text-xs">Click "Add Role" to add login credentials</p>
                </div>
              )}
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting || !demoUrl || !demoName || !sector}
                className="flex-1 command-button-primary"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Register Demo (Pending)
              </Button>
              <Button 
                variant="outline"
                onClick={resetForm}
                className="border-border/50"
              >
                <X className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              <AlertCircle className="w-3 h-3 inline mr-1" />
              Demo will be registered in PENDING state. Activate manually when ready.
            </p>
          </CardContent>
        </Card>

        {/* Right: Registered Demos List */}
        <Card className="glass-panel border-border/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Layers className="w-5 h-5 text-neon-teal" />
                  Registered Demos
                </CardTitle>
                <CardDescription>
                  {registeredDemos.length} demos registered
                </CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={fetchRegisteredDemos}
                className="h-8 w-8"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingDemos ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search demos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary/50"
              />
            </div>

            {/* Demo List */}
            <ScrollArea className="h-[500px]">
              {isLoadingDemos ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : filteredDemos.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Globe className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No demos registered yet</p>
                  <p className="text-xs mt-1">Paste a URL on the left to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredDemos.map((demo) => (
                    <motion.div
                      key={demo.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-lg bg-secondary/30 border border-border/50 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-foreground truncate">
                              {demo.title}
                            </h4>
                            <Badge className={getStatusColor(demo.lifecycle_status === 'pending_activation' ? 'inactive' : demo.status)}>
                              {getStatusLabel(demo.status, demo.lifecycle_status)}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 truncate">
                            {demo.url}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Layers className="w-3 h-3" />
                          {demo.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {demo.login_count} roles
                        </span>
                        <span>
                          {new Date(demo.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {demo.status === 'pending' && (
                          <Button 
                            size="sm" 
                            className="h-7 text-xs bg-neon-green/20 text-neon-green hover:bg-neon-green/30"
                            onClick={() => activateDemo(demo.id)}
                          >
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Activate
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="h-7 text-xs"
                          onClick={() => copyToClipboard(demo.url)}
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          Copy URL
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="h-7 text-xs"
                          onClick={() => window.open(demo.url, '_blank')}
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Open
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="h-7 text-xs text-destructive hover:text-destructive ml-auto"
                          onClick={() => deleteDemo(demo.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DemoURLCollector;
