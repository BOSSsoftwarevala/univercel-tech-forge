import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { 
  Box, Package, Play, Eye, Plus, Edit2, Trash2, Search, Filter,
  BarChart3, TrendingUp, ShoppingCart, Layers, CreditCard, Tag,
  CheckCircle2, XCircle, Clock, AlertCircle, Activity, Settings,
  Image, FileText, Star, Users, Globe2, Download, Upload, RefreshCw,
  Link2, Copy, Calendar, Zap, ArrowUpRight, MoreHorizontal, Check,
  Power, ChevronRight, Timer, Repeat, Share2, Lock, Unlock
} from "lucide-react";
import { useSystemActions } from "@/hooks/useSystemActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

// Mock products data - Including School Management System (LIVE)
const mockProducts = [
  { 
    id: "PRD-001", 
    name: "Enterprise ERP Suite", 
    category: "Software",
    subCategory: "ERP",
    status: "active",
    demos: 45,
    activeUsers: 1250,
    version: "v3.2.1",
    lastUpdated: "2 days ago",
    price: "₹2,50,000",
    rating: 4.8,
    hasDemoMode: true,
    hasLiveMode: true,
  },
  { 
    id: "PRD-002", 
    name: "CRM Professional", 
    category: "Software",
    subCategory: "CRM",
    status: "active",
    demos: 32,
    activeUsers: 890,
    version: "v2.8.0",
    lastUpdated: "5 days ago",
    price: "₹1,50,000",
    rating: 4.6,
    hasDemoMode: true,
    hasLiveMode: true,
  },
  { 
    id: "PRD-003", 
    name: "Inventory Manager Pro", 
    category: "Software",
    subCategory: "Inventory",
    status: "draft",
    demos: 0,
    activeUsers: 0,
    version: "v1.0.0",
    lastUpdated: "1 hour ago",
    price: "₹75,000",
    rating: 0,
    hasDemoMode: false,
    hasLiveMode: false,
  },
  { 
    id: "PRD-004", 
    name: "HR Management System", 
    category: "Software",
    subCategory: "HRMS",
    status: "active",
    demos: 28,
    activeUsers: 670,
    version: "v4.1.2",
    lastUpdated: "1 week ago",
    price: "₹1,25,000",
    rating: 4.5,
    hasDemoMode: true,
    hasLiveMode: true,
  },
  { 
    id: "PRD-005", 
    name: "E-Commerce Platform", 
    category: "Platform",
    subCategory: "Marketplace",
    status: "active",
    demos: 56,
    activeUsers: 1520,
    version: "v5.0.0",
    lastUpdated: "3 days ago",
    price: "₹3,00,000",
    rating: 4.9,
    hasDemoMode: true,
    hasLiveMode: true,
  },
  { 
    id: "PRD-006", 
    name: "Accounting Suite", 
    category: "Software",
    subCategory: "Finance",
    status: "disabled",
    demos: 12,
    activeUsers: 340,
    version: "v2.5.0",
    lastUpdated: "2 weeks ago",
    price: "₹95,000",
    rating: 4.2,
    hasDemoMode: true,
    hasLiveMode: false,
  },
  // ===== SCHOOL MANAGEMENT SYSTEM - LIVE =====
  { 
    id: "PRD-007", 
    name: "School Management System", 
    category: "Software",
    subCategory: "ERP",
    status: "active",
    demos: 89,
    activeUsers: 2450,
    version: "v2.0.0",
    lastUpdated: "1 day ago",
    price: "₹1,85,000",
    rating: 4.9,
    hasDemoMode: true,
    hasLiveMode: true,
    isEducation: true,
    modules: 16,
    roles: 12,
    demoUrl: "/school-software",
    liveUrl: "/school-software/dashboard",
  },
];

// Mock demos data - Including School Management System Demo
const mockDemos = [
  { 
    id: "DEM-001", 
    name: "ERP Enterprise Demo", 
    product: "Enterprise ERP Suite",
    productId: "PRD-001",
    type: "time_based",
    status: "active",
    users: 45,
    validity: "30 days",
    expiresIn: "22 days",
    lastUsed: "2 hours ago",
    url: "demo.erp.example.com",
    username: "demo_user",
    password: "demo123",
    conversionRate: 18.5,
    mode: "demo"
  },
  { 
    id: "DEM-002", 
    name: "CRM Quick Demo", 
    product: "CRM Professional",
    productId: "PRD-002",
    type: "feature_limited",
    status: "active",
    users: 32,
    validity: "15 days",
    expiresIn: "8 days",
    lastUsed: "30 min ago",
    url: "demo.crm.example.com",
    username: "demo_crm",
    password: "crm456",
    conversionRate: 22.3,
    mode: "demo"
  },
  { 
    id: "DEM-003", 
    name: "HR Demo Trial", 
    product: "HR Management System",
    productId: "PRD-004",
    type: "user_limited",
    status: "expired",
    users: 28,
    validity: "7 days",
    expiresIn: "Expired",
    lastUsed: "3 days ago",
    url: "demo.hr.example.com",
    username: "demo_hr",
    password: "hr789",
    conversionRate: 15.2,
    mode: "demo"
  },
  { 
    id: "DEM-004", 
    name: "E-Commerce Full Demo", 
    product: "E-Commerce Platform",
    productId: "PRD-005",
    type: "time_based",
    status: "active",
    users: 56,
    validity: "30 days",
    expiresIn: "28 days",
    lastUsed: "1 hour ago",
    url: "demo.ecom.example.com",
    username: "demo_ecom",
    password: "ecom321",
    conversionRate: 25.8,
    mode: "demo"
  },
  // ===== SCHOOL MANAGEMENT SYSTEM - USER TRIALS (FULL) =====
  { 
    id: "DEM-005", 
    name: "School ERP - User Trial (Full)", 
    product: "School Management System",
    productId: "PRD-007",
    type: "full_trial",
    status: "active",
    users: 89,
    validity: "30 Days",
    expiresIn: "30 days",
    lastUsed: "5 min ago",
    url: "/school-software",
    username: "auto_generated",
    password: "auto",
    conversionRate: 32.5,
    mode: "trial",
    demoRoles: ["principal", "teacher", "student", "parent", "accountant", "librarian", "transport", "admin"],
    isEducation: true,
    modules: 16,
    fullAccess: true,
    directBuy: true
  },
  { 
    id: "DEM-006", 
    name: "School ERP - Principal Trial", 
    product: "School Management System",
    productId: "PRD-007",
    type: "full_trial",
    status: "active",
    users: 45,
    validity: "30 Days",
    expiresIn: "30 days",
    lastUsed: "10 min ago",
    url: "/school-software/dashboard?role=principal",
    username: "trial_principal",
    password: "auto",
    conversionRate: 28.3,
    mode: "trial",
    isEducation: true,
    fullAccess: true,
    directBuy: true
  },
  { 
    id: "DEM-007", 
    name: "School ERP - Teacher Trial", 
    product: "School Management System",
    productId: "PRD-007",
    type: "full_trial",
    status: "active",
    users: 32,
    validity: "30 Days",
    expiresIn: "30 days",
    lastUsed: "15 min ago",
    url: "/school-software/dashboard?role=teacher",
    username: "trial_teacher",
    password: "auto",
    conversionRate: 22.1,
    mode: "trial",
    isEducation: true,
    fullAccess: true,
    directBuy: true
  },
];

const ProductManagerDashboard = () => {
  const { actions, executeAction } = useSystemActions();
  const [activeTab, setActiveTab] = useState("products");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedDemos, setSelectedDemos] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<typeof mockProducts[0] | null>(null);
  const [selectedDemo, setSelectedDemo] = useState<typeof mockDemos[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showCreateDemo, setShowCreateDemo] = useState(false);
  const [createDemoStep, setCreateDemoStep] = useState(1);
  const [demoConfig, setDemoConfig] = useState({ product: "", type: "time_based", duration: "15" });

  // ===== ACTION HANDLERS =====
  const handleEditProduct = useCallback(() => {
    if (!selectedProduct) return;
    actions.update('product', 'product', selectedProduct.id, {}, selectedProduct.name);
  }, [selectedProduct, actions]);

  const handleAddDemo = useCallback(() => {
    if (!selectedProduct) return;
    executeAction({
      module: 'product',
      action: 'create',
      entityType: 'demo',
      entityName: `Demo for ${selectedProduct.name}`,
      data: { productId: selectedProduct.id },
      successMessage: 'Demo created successfully'
    });
    setShowCreateDemo(true);
  }, [selectedProduct, executeAction]);

  const handleUpgradeProduct = useCallback(() => {
    if (!selectedProduct) return;
    executeAction({
      module: 'product',
      action: 'update',
      entityType: 'product_version',
      entityId: selectedProduct.id,
      entityName: selectedProduct.name,
      data: { action: 'upgrade' },
      successMessage: 'Product upgrade initiated'
    });
  }, [selectedProduct, executeAction]);

  const handleDeleteProduct = useCallback(() => {
    if (!selectedProduct) return;
    actions.delete('product', 'product', selectedProduct.id, selectedProduct.name);
  }, [selectedProduct, actions]);

  const handleRefreshProducts = useCallback(() => {
    actions.refresh('product', 'products');
  }, [actions]);

  const handleExportProducts = useCallback(() => {
    actions.export('product', 'products', 'csv');
  }, [actions]);

  const handleImportProducts = useCallback(() => {
    actions.import('product', 'products');
  }, [actions]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "draft": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "disabled": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "expired": return "bg-zinc-500/20 text-zinc-400 border-zinc-500/30";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const handleSelectAll = (items: string[], setItems: (val: string[]) => void, allIds: string[]) => {
    if (items.length === allIds.length) {
      setItems([]);
    } else {
      setItems(allIds);
    }
  };

  const handleBulkAction = (action: string, type: string) => {
    const count = type === "product" ? selectedProducts.length : selectedDemos.length;
    if (count === 0) {
      toast.error(`Select ${type}s first`);
      return;
    }
    // Execute bulk action with audit logging
    executeAction({
      module: 'product',
      action: 'update',
      entityType: type,
      data: { bulkAction: action, count, ids: type === 'product' ? selectedProducts : selectedDemos },
      successMessage: `${action} applied to ${count} ${type}(s)`
    });
    type === "product" ? setSelectedProducts([]) : setSelectedDemos([]);
  };

  const handleCreateDemo = () => {
    if (createDemoStep < 4) {
      setCreateDemoStep(createDemoStep + 1);
    } else {
      toast.success("Demo created successfully!");
      setShowCreateDemo(false);
      setCreateDemoStep(1);
      setDemoConfig({ product: "", type: "time_based", duration: "15" });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || product.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const filteredDemos = mockDemos.filter(demo => {
    const matchesSearch = demo.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          demo.product.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || demo.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950/20 via-background to-violet-950/20 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 flex items-center justify-center shadow-xl">
              <Box className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Product & Demo Manager</h1>
              <p className="text-sm text-muted-foreground">Product Catalog • Demo Control • Bulk Operations</p>
            </div>
          </div>
          <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/50 px-4 py-2">
            <Package className="w-4 h-4 mr-2" />
            PRODUCT MANAGEMENT
          </Badge>
        </div>
      </motion.div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
        {[
          { label: "Products", value: "156", icon: Box, color: "indigo" },
          { label: "Active", value: "142", icon: CheckCircle2, color: "emerald" },
          { label: "Total Demos", value: "324", icon: Play, color: "violet" },
          { label: "Active Demos", value: "289", icon: Zap, color: "blue" },
          { label: "Conversion", value: "18.5%", icon: TrendingUp, color: "emerald" },
          { label: "Users", value: "45.2K", icon: Users, color: "amber" },
        ].map((stat) => (
          <Card key={stat.label} className="bg-card/50 border-indigo-500/10">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <stat.icon className={`w-4 h-4 text-${stat.color}-400`} />
                <span className="text-lg font-bold text-foreground">{stat.value}</span>
              </div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-muted/50 border border-indigo-500/20 p-1 h-auto flex-wrap">
          <TabsTrigger value="products" className="data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-400 gap-2">
            <Box className="w-4 h-4" /> Products
          </TabsTrigger>
          <TabsTrigger value="demos" className="data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-400 gap-2">
            <Play className="w-4 h-4" /> Demo Manager
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-400 gap-2">
            <BarChart3 className="w-4 h-4" /> Analytics
          </TabsTrigger>
        </TabsList>

        {/* ==================== PRODUCTS TAB ==================== */}
        <TabsContent value="products" className="space-y-4">
          {/* Actions Bar */}
          <Card className="bg-card/50 border-indigo-500/10">
            <CardContent className="p-3">
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm" className="bg-indigo-500 hover:bg-indigo-600 gap-1">
                  <Plus className="w-4 h-4" /> Add Product
                </Button>
                <Button size="sm" variant="outline" className="border-indigo-500/30 text-indigo-400 gap-1">
                  <Upload className="w-4 h-4" /> Bulk Upload
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-emerald-500/30 text-emerald-400 gap-1"
                  onClick={() => handleBulkAction("Enabled", "product")}
                >
                  <Power className="w-4 h-4" /> Enable
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-red-500/30 text-red-400 gap-1"
                  onClick={() => handleBulkAction("Disabled", "product")}
                >
                  <XCircle className="w-4 h-4" /> Disable
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-amber-500/30 text-amber-400 gap-1"
                  onClick={() => handleBulkAction("Category assigned", "product")}
                >
                  <Tag className="w-4 h-4" /> Assign Category
                </Button>
                <div className="flex-1" />
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search products..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 h-8 w-48 bg-muted border-indigo-500/20"
                    />
                  </div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-32 h-8 bg-muted border-indigo-500/20">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Software">Software</SelectItem>
                      <SelectItem value="Platform">Platform</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-28 h-8 bg-muted border-indigo-500/20">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="disabled">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Product List */}
            <div className="lg:col-span-2">
              <Card className="bg-card/50 border-indigo-500/10">
                <CardContent className="p-0">
                  {/* Header Row */}
                  <div className="flex items-center gap-3 px-4 py-2 border-b border-indigo-500/10 bg-muted/30">
                    <Checkbox 
                      checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                      onCheckedChange={() => handleSelectAll(selectedProducts, setSelectedProducts, filteredProducts.map(p => p.id))}
                    />
                    <span className="text-xs text-muted-foreground flex-1">
                      {selectedProducts.length > 0 ? `${selectedProducts.length} selected` : "Select all"}
                    </span>
                  </div>
                  <ScrollArea className="h-[480px]">
                    <div className="divide-y divide-indigo-500/10">
                      {filteredProducts.map((product) => (
                        <div 
                          key={product.id}
                          className={`flex items-center gap-3 p-3 cursor-pointer transition-all ${
                            selectedProduct?.id === product.id 
                              ? "bg-indigo-500/10 border-l-2 border-indigo-500" 
                              : "hover:bg-muted/50"
                          }`}
                          onClick={() => setSelectedProduct(product)}
                        >
                          <Checkbox 
                            checked={selectedProducts.includes(product.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedProducts([...selectedProducts, product.id]);
                              } else {
                                setSelectedProducts(selectedProducts.filter(id => id !== product.id));
                              }
                            }}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center flex-shrink-0">
                            <Box className="w-5 h-5 text-indigo-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-foreground text-sm truncate">{product.name}</h3>
                              <Badge className={`${getStatusColor(product.status)} text-xs`}>
                                {product.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {product.category} → {product.subCategory} • {product.version}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Play className="w-3 h-3" /> {product.demos}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" /> {product.activeUsers}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{product.lastUpdated}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Product Detail Panel */}
            <Card className="bg-card/50 border-indigo-500/10">
              <CardContent className="p-4">
                {selectedProduct ? (
                  <div className="space-y-4">
                    <div className="text-center pb-4 border-b border-indigo-500/10">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center mx-auto mb-2">
                        <Box className="w-8 h-8 text-indigo-400" />
                      </div>
                      <h3 className="font-bold text-foreground">{selectedProduct.name}</h3>
                      <Badge className={`${getStatusColor(selectedProduct.status)} mt-1`}>
                        {selectedProduct.status}
                      </Badge>
                    </div>

                    {/* Basic Info */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase">Basic Info</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="p-2 rounded bg-muted/50">
                          <p className="text-xs text-muted-foreground">Category</p>
                          <p className="font-medium text-foreground">{selectedProduct.category}</p>
                        </div>
                        <div className="p-2 rounded bg-muted/50">
                          <p className="text-xs text-muted-foreground">Sub Category</p>
                          <p className="font-medium text-foreground">{selectedProduct.subCategory}</p>
                        </div>
                        <div className="p-2 rounded bg-muted/50">
                          <p className="text-xs text-muted-foreground">Version</p>
                          <p className="font-medium text-foreground">{selectedProduct.version}</p>
                        </div>
                        <div className="p-2 rounded bg-muted/50">
                          <p className="text-xs text-muted-foreground">Price</p>
                          <p className="font-medium text-foreground">{selectedProduct.price}</p>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase">Performance</h4>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2 rounded bg-indigo-500/10">
                          <p className="text-lg font-bold text-indigo-400">{selectedProduct.demos}</p>
                          <p className="text-xs text-muted-foreground">Demos</p>
                        </div>
                        <div className="p-2 rounded bg-emerald-500/10">
                          <p className="text-lg font-bold text-emerald-400">{selectedProduct.activeUsers}</p>
                          <p className="text-xs text-muted-foreground">Users</p>
                        </div>
                        <div className="p-2 rounded bg-amber-500/10">
                          <p className="text-lg font-bold text-amber-400">{selectedProduct.rating || "N/A"}</p>
                          <p className="text-xs text-muted-foreground">Rating</p>
                        </div>
                      </div>
                    </div>

                    {/* Demo Settings */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase">Demo Settings</h4>
                      <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                        <span className="text-sm text-foreground">Demo Enabled</span>
                        <Switch defaultChecked={selectedProduct.demos > 0} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <Button size="sm" variant="outline" className="border-indigo-500/30 text-indigo-400 gap-1" onClick={handleEditProduct}>
                        <Edit2 className="w-3 h-3" /> Edit
                      </Button>
                      <Button size="sm" variant="outline" className="border-emerald-500/30 text-emerald-400 gap-1" onClick={handleAddDemo}>
                        <Play className="w-3 h-3" /> Add Demo
                      </Button>
                      <Button size="sm" variant="outline" className="border-amber-500/30 text-amber-400 gap-1" onClick={handleUpgradeProduct}>
                        <ArrowUpRight className="w-3 h-3" /> Upgrade
                      </Button>
                      <Button size="sm" variant="outline" className="border-red-500/30 text-red-400 gap-1" onClick={handleDeleteProduct}>
                        <Trash2 className="w-3 h-3" /> Delete
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <Box className="w-12 h-12 text-indigo-400/30 mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">Select a product to view details</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ==================== DEMO MANAGER TAB ==================== */}
        <TabsContent value="demos" className="space-y-4">
          {/* Create Demo Flow */}
          {showCreateDemo ? (
            <Card className="bg-card/50 border-indigo-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-foreground">Create New Demo</h3>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4].map((step) => (
                      <div 
                        key={step}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          step === createDemoStep 
                            ? "bg-indigo-500 text-white" 
                            : step < createDemoStep 
                            ? "bg-emerald-500 text-white" 
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {step < createDemoStep ? <Check className="w-4 h-4" /> : step}
                      </div>
                    ))}
                  </div>
                </div>

                {createDemoStep === 1 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-foreground">Step 1: Select Product</h4>
                    <Select value={demoConfig.product} onValueChange={(val) => setDemoConfig({...demoConfig, product: val})}>
                      <SelectTrigger className="bg-muted border-indigo-500/20">
                        <SelectValue placeholder="Select a product" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockProducts.filter(p => p.status === "active").map((p) => (
                          <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {createDemoStep === 2 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-foreground">Step 2: Demo Type</h4>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: "time_based", label: "Time Based", desc: "7/15/30 days" },
                        { id: "feature_limited", label: "Feature Limited", desc: "Restricted features" },
                        { id: "user_limited", label: "User Limited", desc: "Limited users" },
                      ].map((type) => (
                        <div 
                          key={type.id}
                          onClick={() => setDemoConfig({...demoConfig, type: type.id})}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            demoConfig.type === type.id 
                              ? "border-indigo-500 bg-indigo-500/10" 
                              : "border-muted hover:border-indigo-500/50"
                          }`}
                        >
                          <p className="font-medium text-foreground text-sm">{type.label}</p>
                          <p className="text-xs text-muted-foreground">{type.desc}</p>
                        </div>
                      ))}
                    </div>
                    {demoConfig.type === "time_based" && (
                      <div className="flex gap-2 mt-3">
                        {["7", "15", "30"].map((days) => (
                          <Button 
                            key={days}
                            size="sm"
                            variant={demoConfig.duration === days ? "default" : "outline"}
                            onClick={() => setDemoConfig({...demoConfig, duration: days})}
                            className={demoConfig.duration === days ? "bg-indigo-500" : ""}
                          >
                            {days} Days
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {createDemoStep === 3 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-foreground">Step 3: Demo Access</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1">Demo URL</p>
                        <p className="text-sm font-mono text-foreground">demo.product.example.com</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1">Auto Login</p>
                        <Switch defaultChecked />
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1">Username</p>
                        <p className="text-sm font-mono text-foreground">demo_user_new</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1">Password</p>
                        <p className="text-sm font-mono text-foreground">auto_generated</p>
                      </div>
                    </div>
                  </div>
                )}

                {createDemoStep === 4 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-foreground">Step 4: Confirm</h4>
                    <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                      <p className="text-center text-foreground">Ready to create demo</p>
                      <p className="text-center text-sm text-muted-foreground">
                        {demoConfig.type} • {demoConfig.duration} days
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex justify-between mt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      if (createDemoStep > 1) setCreateDemoStep(createDemoStep - 1);
                      else setShowCreateDemo(false);
                    }}
                  >
                    {createDemoStep === 1 ? "Cancel" : "Back"}
                  </Button>
                  <Button 
                    className="bg-indigo-500 hover:bg-indigo-600"
                    onClick={handleCreateDemo}
                  >
                    {createDemoStep === 4 ? "Create Demo" : "Next"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Demo Actions Bar */}
              <Card className="bg-card/50 border-indigo-500/10">
                <CardContent className="p-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <Button size="sm" className="bg-indigo-500 hover:bg-indigo-600 gap-1" onClick={() => setShowCreateDemo(true)}>
                      <Plus className="w-4 h-4" /> Create Demo
                    </Button>
                    <Button size="sm" variant="outline" className="border-indigo-500/30 text-indigo-400 gap-1">
                      <Upload className="w-4 h-4" /> Bulk Create
                    </Button>
                    <Separator orientation="vertical" className="h-6" />
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-emerald-500/30 text-emerald-400 gap-1"
                      onClick={() => handleBulkAction("Extended", "demo")}
                    >
                      <Timer className="w-4 h-4" /> Extend
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-blue-500/30 text-blue-400 gap-1"
                      onClick={() => handleBulkAction("Limit increased", "demo")}
                    >
                      <ArrowUpRight className="w-4 h-4" /> Increase Limit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-amber-500/30 text-amber-400 gap-1"
                      onClick={() => handleBulkAction("Reset", "demo")}
                    >
                      <RefreshCw className="w-4 h-4" /> Reset
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-red-500/30 text-red-400 gap-1"
                      onClick={() => handleBulkAction("Disabled", "demo")}
                    >
                      <XCircle className="w-4 h-4" /> Disable
                    </Button>
                    <div className="flex-1" />
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                          placeholder="Search demos..." 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-8 h-8 w-48 bg-muted border-indigo-500/20"
                        />
                      </div>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-28 h-8 bg-muted border-indigo-500/20">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="expired">Expired</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button size="sm" variant="outline" className="h-8 gap-1">
                        <Download className="w-4 h-4" /> Export
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Demo List */}
                <div className="lg:col-span-2">
                  <Card className="bg-card/50 border-indigo-500/10">
                    <CardContent className="p-0">
                      <div className="flex items-center gap-3 px-4 py-2 border-b border-indigo-500/10 bg-muted/30">
                        <Checkbox 
                          checked={selectedDemos.length === filteredDemos.length && filteredDemos.length > 0}
                          onCheckedChange={() => handleSelectAll(selectedDemos, setSelectedDemos, filteredDemos.map(d => d.id))}
                        />
                        <span className="text-xs text-muted-foreground flex-1">
                          {selectedDemos.length > 0 ? `${selectedDemos.length} selected` : "Select all"}
                        </span>
                      </div>
                      <ScrollArea className="h-[440px]">
                        <div className="divide-y divide-indigo-500/10">
                          {filteredDemos.map((demo) => (
                            <div 
                              key={demo.id}
                              className={`flex items-center gap-3 p-3 cursor-pointer transition-all ${
                                selectedDemo?.id === demo.id 
                                  ? "bg-indigo-500/10 border-l-2 border-indigo-500" 
                                  : "hover:bg-muted/50"
                              }`}
                              onClick={() => setSelectedDemo(demo)}
                            >
                              <Checkbox 
                                checked={selectedDemos.includes(demo.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedDemos([...selectedDemos, demo.id]);
                                  } else {
                                    setSelectedDemos(selectedDemos.filter(id => id !== demo.id));
                                  }
                                }}
                                onClick={(e) => e.stopPropagation()}
                              />
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center flex-shrink-0">
                                <Play className="w-5 h-5 text-emerald-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium text-foreground text-sm truncate">{demo.name}</h3>
                                  <Badge className={`${getStatusColor(demo.status)} text-xs`}>
                                    {demo.status}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs border-indigo-500/30 text-indigo-400">
                                    {demo.type.replace("_", " ")}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {demo.product} • {demo.validity}
                                </p>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Users className="w-3 h-3" /> {demo.users}
                                  </span>
                                  <span className={demo.status === "expired" ? "text-red-400" : "text-emerald-400"}>
                                    {demo.expiresIn}
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5">{demo.lastUsed}</p>
                              </div>
                              <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>

                {/* Demo Detail Panel */}
                <Card className="bg-card/50 border-indigo-500/10">
                  <CardContent className="p-4">
                    {selectedDemo ? (
                      <div className="space-y-4">
                        <div className="text-center pb-3 border-b border-indigo-500/10">
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center mx-auto mb-2">
                            <Play className="w-7 h-7 text-emerald-400" />
                          </div>
                          <h3 className="font-bold text-foreground">{selectedDemo.name}</h3>
                          <Badge className={`${getStatusColor(selectedDemo.status)} mt-1`}>
                            {selectedDemo.status}
                          </Badge>
                        </div>

                        {/* Demo Access */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase">Access Details</h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                              <div>
                                <p className="text-xs text-muted-foreground">Demo URL</p>
                                <p className="text-sm font-mono text-foreground">{selectedDemo.url}</p>
                              </div>
                              <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => copyToClipboard(selectedDemo.url)}>
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="p-2 rounded bg-muted/50">
                                <p className="text-xs text-muted-foreground">Username</p>
                                <p className="text-sm font-mono text-foreground">{selectedDemo.username}</p>
                              </div>
                              <div className="p-2 rounded bg-muted/50">
                                <p className="text-xs text-muted-foreground">Password</p>
                                <p className="text-sm font-mono text-foreground">{selectedDemo.password}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase">Usage Stats</h4>
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="p-2 rounded bg-blue-500/10">
                              <p className="text-lg font-bold text-blue-400">{selectedDemo.users}</p>
                              <p className="text-xs text-muted-foreground">Users</p>
                            </div>
                            <div className="p-2 rounded bg-amber-500/10">
                              <p className="text-lg font-bold text-amber-400">{selectedDemo.validity}</p>
                              <p className="text-xs text-muted-foreground">Validity</p>
                            </div>
                            <div className="p-2 rounded bg-emerald-500/10">
                              <p className="text-lg font-bold text-emerald-400">{selectedDemo.conversionRate}%</p>
                              <p className="text-xs text-muted-foreground">Convert</p>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-2 pt-2">
                          <Button size="sm" variant="outline" className="border-emerald-500/30 text-emerald-400 gap-1">
                            <Timer className="w-3 h-3" /> Extend
                          </Button>
                          <Button size="sm" variant="outline" className="border-blue-500/30 text-blue-400 gap-1">
                            <ArrowUpRight className="w-3 h-3" /> Increase
                          </Button>
                          <Button size="sm" variant="outline" className="border-amber-500/30 text-amber-400 gap-1">
                            <RefreshCw className="w-3 h-3" /> Reset
                          </Button>
                          <Button size="sm" variant="outline" className="border-indigo-500/30 text-indigo-400 gap-1">
                            <Share2 className="w-3 h-3" /> Share
                          </Button>
                          <Button size="sm" variant="outline" className="border-violet-500/30 text-violet-400 gap-1">
                            <CreditCard className="w-3 h-3" /> Convert
                          </Button>
                          <Button size="sm" variant="outline" className="border-red-500/30 text-red-400 gap-1">
                            <XCircle className="w-3 h-3" /> Disable
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-16">
                        <Play className="w-12 h-12 text-emerald-400/30 mx-auto mb-3" />
                        <p className="text-muted-foreground text-sm">Select a demo to view details</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        {/* ==================== ANALYTICS TAB ==================== */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Product Analytics */}
            <Card className="bg-card/50 border-indigo-500/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-foreground flex items-center gap-2 text-base">
                  <Box className="w-5 h-5 text-indigo-400" />
                  Product Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-indigo-500/10 text-center">
                    <p className="text-2xl font-bold text-indigo-400">156</p>
                    <p className="text-xs text-muted-foreground">Total Products</p>
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-500/10 text-center">
                    <p className="text-2xl font-bold text-emerald-400">142</p>
                    <p className="text-xs text-muted-foreground">Active Products</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase">Top Products by Demos</h4>
                  {mockProducts.filter(p => p.status === "active").slice(0, 4).map((product) => (
                    <div key={product.id} className="flex items-center gap-2">
                      <div className="flex-1">
                        <p className="text-sm text-foreground">{product.name}</p>
                        <Progress value={(product.demos / 60) * 100} className="h-1.5 mt-1" />
                      </div>
                      <span className="text-sm font-mono text-muted-foreground">{product.demos}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Demo Analytics */}
            <Card className="bg-card/50 border-indigo-500/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-foreground flex items-center gap-2 text-base">
                  <Play className="w-5 h-5 text-emerald-400" />
                  Demo Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-violet-500/10 text-center">
                    <p className="text-2xl font-bold text-violet-400">324</p>
                    <p className="text-xs text-muted-foreground">Total Demos</p>
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-500/10 text-center">
                    <p className="text-2xl font-bold text-emerald-400">289</p>
                    <p className="text-xs text-muted-foreground">Active Demos</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-amber-500/10 text-center">
                    <p className="text-2xl font-bold text-amber-400">35</p>
                    <p className="text-xs text-muted-foreground">Expired</p>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-500/10 text-center">
                    <p className="text-2xl font-bold text-blue-400">18.5%</p>
                    <p className="text-xs text-muted-foreground">Conversion Rate</p>
                  </div>
                </div>
                <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Demo → Paid Conversion</p>
                      <p className="text-xs text-muted-foreground">58 conversions this month (+12%)</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Demo Growth Features */}
          <Card className="bg-card/50 border-indigo-500/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-foreground flex items-center gap-2 text-base">
                <Zap className="w-5 h-5 text-amber-400" />
                Demo Growth Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                {[
                  { icon: Link2, label: "Auto URL Generator", enabled: true },
                  { icon: Share2, label: "One-Click Share", enabled: true },
                  { icon: BarChart3, label: "Usage Tracking", enabled: true },
                  { icon: Clock, label: "Expiry Reminder", enabled: true },
                  { icon: Repeat, label: "Auto Extend", enabled: false },
                  { icon: TrendingUp, label: "Conversion Analytics", enabled: true },
                ].map((feature, i) => (
                  <div key={i} className="p-3 rounded-lg bg-muted/50 border border-indigo-500/10">
                    <div className="flex items-center justify-between mb-2">
                      <feature.icon className="w-5 h-5 text-indigo-400" />
                      <Switch defaultChecked={feature.enabled} />
                    </div>
                    <p className="text-xs font-medium text-foreground">{feature.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductManagerDashboard;
