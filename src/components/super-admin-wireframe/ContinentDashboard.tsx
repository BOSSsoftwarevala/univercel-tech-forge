import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Globe2, Users, Building, TrendingUp, Activity, MapPin,
  ChevronRight, AlertCircle, CheckCircle, Clock, Eye,
  Target, DollarSign, UserCheck, Store, Filter, Download,
  BarChart3, PieChart, Zap, Bell, Shield, X, ArrowUpRight,
  ArrowDownRight, RefreshCw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface CountryData {
  id: string;
  name: string;
  admin: string;
  status: "healthy" | "warning" | "critical";
  franchises: number;
  resellers: number;
  leads: number;
  revenue: number;
  lat: number;
  lng: number;
  hasFranchise: boolean;
}

export interface ContinentConfig {
  name: string;
  code: string;
  icon: string;
  color: string;
  countries: CountryData[];
  mapViewBox: string;
  mapPath: string;
  coordTransform: (lat: number, lng: number) => { x: number; y: number };
}

// Continent configurations
export const continentConfigs: Record<string, ContinentConfig> = {
  "Asia": {
    name: "Asia",
    code: "CSA-ASIA-001",
    icon: "🌏",
    color: "from-red-500 to-orange-500",
    mapViewBox: "0 0 600 400",
    mapPath: "M100,50 L200,30 L350,40 L480,80 L550,150 L580,250 L550,320 L450,350 L350,340 L250,360 L150,320 L80,250 L50,150 L100,50 Z",
    coordTransform: (lat, lng) => ({
      x: ((lng - 60) / 90) * 500 + 50,
      y: ((45 - lat) / 60) * 350 + 25
    }),
    countries: [
      { id: "IN", name: "India", admin: "Raj Patel", status: "healthy", franchises: 45, resellers: 120, leads: 340, revenue: 2400000, lat: 20.5937, lng: 78.9629, hasFranchise: true },
      { id: "CN", name: "China", admin: "Li Wei", status: "healthy", franchises: 62, resellers: 200, leads: 520, revenue: 4500000, lat: 35.8617, lng: 104.1954, hasFranchise: true },
      { id: "JP", name: "Japan", admin: "Yuki Tanaka", status: "healthy", franchises: 28, resellers: 80, leads: 180, revenue: 3200000, lat: 36.2048, lng: 138.2529, hasFranchise: true },
      { id: "KR", name: "South Korea", admin: "Kim Min-jun", status: "healthy", franchises: 22, resellers: 55, leads: 145, revenue: 1800000, lat: 35.9078, lng: 127.7669, hasFranchise: true },
      { id: "ID", name: "Indonesia", admin: "Budi Santoso", status: "warning", franchises: 18, resellers: 45, leads: 95, revenue: 950000, lat: -0.7893, lng: 113.9213, hasFranchise: true },
      { id: "TH", name: "Thailand", admin: "Somchai Prasert", status: "healthy", franchises: 15, resellers: 40, leads: 110, revenue: 780000, lat: 15.87, lng: 100.9925, hasFranchise: true },
      { id: "VN", name: "Vietnam", admin: "Nguyen Van", status: "healthy", franchises: 12, resellers: 35, leads: 88, revenue: 620000, lat: 14.0583, lng: 108.2772, hasFranchise: true },
      { id: "PH", name: "Philippines", admin: "Jose Santos", status: "healthy", franchises: 14, resellers: 38, leads: 92, revenue: 540000, lat: 12.8797, lng: 121.774, hasFranchise: true },
      { id: "MY", name: "Malaysia", admin: "Ahmad Hassan", status: "healthy", franchises: 10, resellers: 28, leads: 75, revenue: 480000, lat: 4.2105, lng: 101.9758, hasFranchise: true },
      { id: "SG", name: "Singapore", admin: "David Tan", status: "healthy", franchises: 8, resellers: 22, leads: 60, revenue: 920000, lat: 1.3521, lng: 103.8198, hasFranchise: true },
      { id: "AE", name: "UAE", admin: "Mohammed Ali", status: "healthy", franchises: 12, resellers: 30, leads: 85, revenue: 1200000, lat: 23.4241, lng: 53.8478, hasFranchise: true },
      { id: "SA", name: "Saudi Arabia", admin: "Abdullah Saleh", status: "healthy", franchises: 9, resellers: 24, leads: 68, revenue: 980000, lat: 23.8859, lng: 45.0792, hasFranchise: true },
    ]
  },
  "Africa": {
    name: "Africa",
    code: "CSA-AFRICA-001",
    icon: "🌍",
    color: "from-amber-500 to-yellow-500",
    mapViewBox: "0 0 600 400",
    mapPath: "M200,30 L350,20 L450,80 L480,180 L450,300 L380,380 L280,390 L180,350 L120,250 L150,120 L200,30 Z",
    coordTransform: (lat, lng) => ({
      x: ((lng + 20) / 60) * 400 + 100,
      y: ((35 - lat) / 70) * 350 + 25
    }),
    countries: [
      { id: "NG", name: "Nigeria", admin: "Chukwu Emeka", status: "healthy", franchises: 25, resellers: 65, leads: 180, revenue: 1200000, lat: 9.082, lng: 8.6753, hasFranchise: true },
      { id: "EG", name: "Egypt", admin: "Ahmed Hassan", status: "healthy", franchises: 18, resellers: 45, leads: 120, revenue: 980000, lat: 26.8206, lng: 30.8025, hasFranchise: true },
      { id: "ZA", name: "South Africa", admin: "Johan Van Der Berg", status: "healthy", franchises: 32, resellers: 85, leads: 220, revenue: 1800000, lat: -30.5595, lng: 22.9375, hasFranchise: true },
      { id: "KE", name: "Kenya", admin: "James Ochieng", status: "warning", franchises: 12, resellers: 30, leads: 85, revenue: 450000, lat: -0.0236, lng: 37.9062, hasFranchise: true },
      { id: "GH", name: "Ghana", admin: "Kwame Asante", status: "healthy", franchises: 8, resellers: 22, leads: 55, revenue: 320000, lat: 7.9465, lng: -1.0232, hasFranchise: true },
      { id: "MA", name: "Morocco", admin: "Youssef Benali", status: "healthy", franchises: 14, resellers: 35, leads: 95, revenue: 650000, lat: 31.7917, lng: -7.0926, hasFranchise: true },
      { id: "ET", name: "Ethiopia", admin: "Not Assigned", status: "critical", franchises: 0, resellers: 5, leads: 15, revenue: 25000, lat: 9.145, lng: 40.4897, hasFranchise: false },
      { id: "TZ", name: "Tanzania", admin: "Joseph Mwanga", status: "warning", franchises: 5, resellers: 12, leads: 35, revenue: 180000, lat: -6.369, lng: 34.8888, hasFranchise: true },
    ]
  },
  "Europe": {
    name: "Europe",
    code: "CSA-EUROPE-001",
    icon: "🌍",
    color: "from-blue-500 to-indigo-500",
    mapViewBox: "0 0 600 400",
    mapPath: "M80,100 L200,50 L400,40 L520,80 L550,180 L500,280 L380,320 L200,300 L100,250 L50,180 L80,100 Z",
    coordTransform: (lat, lng) => ({
      x: ((lng + 25) / 70) * 500 + 50,
      y: ((70 - lat) / 40) * 300 + 50
    }),
    countries: [
      { id: "DE", name: "Germany", admin: "Klaus Schmidt", status: "healthy", franchises: 42, resellers: 110, leads: 280, revenue: 3200000, lat: 51.1657, lng: 10.4515, hasFranchise: true },
      { id: "FR", name: "France", admin: "Pierre Dubois", status: "healthy", franchises: 38, resellers: 95, leads: 245, revenue: 2800000, lat: 46.2276, lng: 2.2137, hasFranchise: true },
      { id: "GB", name: "United Kingdom", admin: "James Wilson", status: "healthy", franchises: 45, resellers: 120, leads: 310, revenue: 3500000, lat: 55.3781, lng: -3.436, hasFranchise: true },
      { id: "IT", name: "Italy", admin: "Marco Rossi", status: "healthy", franchises: 28, resellers: 72, leads: 185, revenue: 1950000, lat: 41.8719, lng: 12.5674, hasFranchise: true },
      { id: "ES", name: "Spain", admin: "Carlos Garcia", status: "warning", franchises: 22, resellers: 58, leads: 145, revenue: 1400000, lat: 40.4637, lng: -3.7492, hasFranchise: true },
      { id: "NL", name: "Netherlands", admin: "Jan De Vries", status: "healthy", franchises: 18, resellers: 45, leads: 120, revenue: 1200000, lat: 52.1326, lng: 5.2913, hasFranchise: true },
      { id: "PL", name: "Poland", admin: "Piotr Kowalski", status: "healthy", franchises: 15, resellers: 38, leads: 98, revenue: 780000, lat: 51.9194, lng: 19.1451, hasFranchise: true },
      { id: "SE", name: "Sweden", admin: "Erik Lindqvist", status: "healthy", franchises: 12, resellers: 30, leads: 75, revenue: 920000, lat: 60.1282, lng: 18.6435, hasFranchise: true },
    ]
  },
  "North America": {
    name: "North America",
    code: "CSA-NA-001",
    icon: "🌎",
    color: "from-emerald-500 to-teal-500",
    mapViewBox: "0 0 600 400",
    mapPath: "M50,50 L250,30 L450,60 L550,150 L520,280 L400,350 L250,380 L100,320 L30,200 L50,50 Z",
    coordTransform: (lat, lng) => ({
      x: ((lng + 170) / 90) * 500 + 50,
      y: ((70 - lat) / 50) * 320 + 40
    }),
    countries: [
      { id: "US", name: "United States", admin: "John Smith", status: "healthy", franchises: 85, resellers: 250, leads: 680, revenue: 8500000, lat: 37.0902, lng: -95.7129, hasFranchise: true },
      { id: "CA", name: "Canada", admin: "Michael Brown", status: "healthy", franchises: 35, resellers: 90, leads: 220, revenue: 2800000, lat: 56.1304, lng: -106.3468, hasFranchise: true },
      { id: "MX", name: "Mexico", admin: "Roberto Martinez", status: "healthy", franchises: 28, resellers: 75, leads: 180, revenue: 1450000, lat: 23.6345, lng: -102.5528, hasFranchise: true },
      { id: "GT", name: "Guatemala", admin: "Carlos Mendez", status: "warning", franchises: 5, resellers: 12, leads: 35, revenue: 180000, lat: 15.7835, lng: -90.2308, hasFranchise: true },
      { id: "CU", name: "Cuba", admin: "Not Assigned", status: "critical", franchises: 0, resellers: 0, leads: 8, revenue: 0, lat: 21.5218, lng: -77.7812, hasFranchise: false },
      { id: "JM", name: "Jamaica", admin: "Devon Williams", status: "healthy", franchises: 3, resellers: 8, leads: 22, revenue: 95000, lat: 18.1096, lng: -77.2975, hasFranchise: true },
    ]
  },
  "South America": {
    name: "South America",
    code: "CSA-SA-001",
    icon: "🌎",
    color: "from-green-500 to-lime-500",
    mapViewBox: "0 0 600 400",
    mapPath: "M200,30 L350,50 L420,150 L380,280 L300,380 L180,350 L120,220 L150,100 L200,30 Z",
    coordTransform: (lat, lng) => ({
      x: ((lng + 80) / 50) * 400 + 100,
      y: ((10 - lat) / 60) * 350 + 25
    }),
    countries: [
      { id: "BR", name: "Brazil", admin: "João Silva", status: "healthy", franchises: 52, resellers: 140, leads: 380, revenue: 3200000, lat: -14.235, lng: -51.9253, hasFranchise: true },
      { id: "AR", name: "Argentina", admin: "Diego Fernandez", status: "warning", franchises: 22, resellers: 58, leads: 145, revenue: 1100000, lat: -38.4161, lng: -63.6167, hasFranchise: true },
      { id: "CO", name: "Colombia", admin: "Carlos Mendez", status: "healthy", franchises: 18, resellers: 45, leads: 120, revenue: 850000, lat: 4.5709, lng: -74.2973, hasFranchise: true },
      { id: "CL", name: "Chile", admin: "Pablo Gonzalez", status: "healthy", franchises: 15, resellers: 38, leads: 95, revenue: 720000, lat: -35.6751, lng: -71.543, hasFranchise: true },
      { id: "PE", name: "Peru", admin: "Luis Vargas", status: "healthy", franchises: 12, resellers: 30, leads: 78, revenue: 520000, lat: -9.19, lng: -75.0152, hasFranchise: true },
      { id: "VE", name: "Venezuela", admin: "Not Assigned", status: "critical", franchises: 0, resellers: 5, leads: 12, revenue: 15000, lat: 6.4238, lng: -66.5897, hasFranchise: false },
      { id: "EC", name: "Ecuador", admin: "Maria Torres", status: "healthy", franchises: 8, resellers: 20, leads: 55, revenue: 280000, lat: -1.8312, lng: -78.1834, hasFranchise: true },
    ]
  },
  "Australia/Oceania": {
    name: "Australia/Oceania",
    code: "CSA-AU-001",
    icon: "🌏",
    color: "from-cyan-500 to-sky-500",
    mapViewBox: "0 0 600 400",
    mapPath: "M100,100 L300,80 L500,120 L550,220 L480,320 L300,350 L120,300 L50,200 L100,100 Z",
    coordTransform: (lat, lng) => ({
      x: ((lng - 110) / 70) * 450 + 75,
      y: ((-10 - lat) / 40) * 250 + 75
    }),
    countries: [
      { id: "AU", name: "Australia", admin: "Jack Thompson", status: "healthy", franchises: 38, resellers: 95, leads: 245, revenue: 2800000, lat: -25.2744, lng: 133.7751, hasFranchise: true },
      { id: "NZ", name: "New Zealand", admin: "William Clarke", status: "healthy", franchises: 15, resellers: 38, leads: 95, revenue: 920000, lat: -40.9006, lng: 174.886, hasFranchise: true },
      { id: "FJ", name: "Fiji", admin: "Ratu Meli", status: "healthy", franchises: 4, resellers: 10, leads: 28, revenue: 145000, lat: -17.7134, lng: 178.065, hasFranchise: true },
      { id: "PG", name: "Papua New Guinea", admin: "Not Assigned", status: "critical", franchises: 0, resellers: 2, leads: 8, revenue: 12000, lat: -6.315, lng: 143.9555, hasFranchise: false },
      { id: "NC", name: "New Caledonia", admin: "François Martin", status: "warning", franchises: 2, resellers: 5, leads: 15, revenue: 85000, lat: -20.9043, lng: 165.618, hasFranchise: true },
    ]
  },
  "Antarctica": {
    name: "Antarctica",
    code: "CSA-ANT-001",
    icon: "🧊",
    color: "from-slate-400 to-slate-500",
    mapViewBox: "0 0 600 400",
    mapPath: "M100,200 L250,150 L400,150 L500,200 L480,280 L350,320 L200,320 L100,280 L100,200 Z",
    coordTransform: (lat, lng) => ({
      x: ((lng + 180) / 360) * 500 + 50,
      y: 200
    }),
    countries: [] // No franchises in Antarctica
  }
};

interface ContinentDashboardProps {
  continent: string;
  onBack?: () => void;
}

const ContinentDashboard = ({ continent, onBack }: ContinentDashboardProps) => {
  const config = continentConfigs[continent];
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [mapView, setMapView] = useState<"franchise" | "reseller" | "leads">("franchise");
  const [statusFilter, setStatusFilter] = useState("all");

  if (!config) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-slate-400">Configuration not found for {continent}</p>
      </div>
    );
  }

  const filteredCountries = useMemo(() => {
    if (statusFilter === "all") return config.countries;
    return config.countries.filter(c => c.status === statusFilter);
  }, [statusFilter, config.countries]);

  const countriesWithFranchise = config.countries.filter(c => c.hasFranchise).length;
  const totalFranchises = config.countries.reduce((sum, c) => sum + c.franchises, 0);
  const totalResellers = config.countries.reduce((sum, c) => sum + c.resellers, 0);
  const totalLeads = config.countries.reduce((sum, c) => sum + c.leads, 0);
  const totalRevenue = config.countries.reduce((sum, c) => sum + c.revenue, 0);

  const summaryStats = [
    { label: "Countries", value: config.countries.length.toString(), change: "+1", icon: Globe2, color: "from-blue-500 to-cyan-500" },
    { label: "Active Admins", value: config.countries.filter(c => c.admin !== "Not Assigned").length.toString(), change: "+2", icon: UserCheck, color: "from-emerald-500 to-green-500" },
    { label: "Franchises", value: totalFranchises.toString(), change: "+8", icon: Building, color: "from-purple-500 to-violet-500" },
    { label: "Resellers", value: totalResellers.toString(), change: "+25", icon: Store, color: "from-orange-500 to-amber-500" },
    { label: "Active Leads", value: totalLeads.toLocaleString(), change: "+86", icon: Target, color: "from-pink-500 to-rose-500" },
    { label: "Revenue", value: `₹${(totalRevenue / 1000000).toFixed(1)}M`, change: "+5.2%", icon: DollarSign, color: "from-yellow-500 to-orange-500" },
  ];

  const liveActivities = [
    { id: 1, type: "lead", message: `New lead created in ${config.countries[0]?.name || continent}`, time: "2 min ago" },
    { id: 2, type: "franchise", message: `Franchise onboarded in ${config.countries[1]?.name || continent}`, time: "5 min ago" },
    { id: 3, type: "demo", message: `Demo activated in ${config.countries[2]?.name || continent}`, time: "8 min ago" },
    { id: 4, type: "conversion", message: `Reseller converted`, time: "12 min ago" },
    { id: 5, type: "alert", message: `Compliance check completed`, time: "15 min ago" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy": return "bg-emerald-500";
      case "warning": return "bg-amber-500";
      case "critical": return "bg-red-500";
      default: return "bg-slate-500";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "healthy": return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50">Healthy</Badge>;
      case "warning": return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/50">Warning</Badge>;
      case "critical": return <Badge className="bg-red-500/20 text-red-400 border-red-500/50">Critical</Badge>;
      default: return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-950 via-blue-950/30 to-slate-950">
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ChevronRight className="w-5 h-5 rotate-180" />
              </Button>
            )}
            <div className={cn("w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center text-3xl shadow-lg", config.color)}>
              {config.icon}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{config.name} Super Admin</h1>
              <p className="text-slate-400">{config.code} • Continent Scope: {config.name} Only</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50 px-3 py-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
              Live Monitoring
            </Badge>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {summaryStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-slate-900/50 border-slate-700/50 hover:border-slate-600 transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br", stat.color)}>
                        <stat.icon className="w-5 h-5 text-white" />
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-0 text-xs">
                        <ArrowUpRight className="w-3 h-3 mr-1" />
                        {stat.change}
                      </Badge>
                    </div>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-slate-400">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Main Content - Map + Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map */}
            <Card className="lg:col-span-2 bg-slate-900/50 border-slate-700/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Globe2 className="w-5 h-5 text-cyan-400" />
                    {config.name} Map Overview
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Select value={mapView} onValueChange={(v: any) => setMapView(v)}>
                      <SelectTrigger className="w-32 h-8 bg-slate-800 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="franchise">Franchise</SelectItem>
                        <SelectItem value="reseller">Reseller</SelectItem>
                        <SelectItem value="leads">Leads</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-28 h-8 bg-slate-800 border-slate-600">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="healthy">Healthy</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative w-full h-[400px] bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl overflow-hidden border border-slate-700/50">
                  {/* Map Background Grid */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="w-full h-full" style={{
                      backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
                      backgroundSize: '40px 40px'
                    }} />
                  </div>

                  {/* Continent Shape */}
                  <svg viewBox={config.mapViewBox} className="absolute inset-0 w-full h-full">
                    <path
                      d={config.mapPath}
                      fill="rgba(59, 130, 246, 0.1)"
                      stroke="rgba(59, 130, 246, 0.3)"
                      strokeWidth="2"
                    />
                  </svg>

                  {/* Country Markers */}
                  {filteredCountries.map((country, index) => {
                    const pos = config.coordTransform(country.lat, country.lng);
                    const size = mapView === "franchise" 
                      ? Math.max(12, Math.min(40, country.franchises * 0.8))
                      : mapView === "reseller"
                      ? Math.max(12, Math.min(40, country.resellers * 0.3))
                      : Math.max(12, Math.min(40, country.leads * 0.1));

                    return (
                      <Tooltip key={country.id} delayDuration={0}>
                        <TooltipTrigger asChild>
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: index * 0.03 }}
                            onClick={() => setSelectedCountry(country)}
                            className={cn(
                              "absolute cursor-pointer rounded-full flex items-center justify-center transition-all",
                              selectedCountry?.id === country.id && "ring-4 ring-cyan-400/50"
                            )}
                            style={{
                              left: `${Math.max(20, Math.min(580, pos.x))}px`,
                              top: `${Math.max(20, Math.min(380, pos.y))}px`,
                              width: `${size}px`,
                              height: `${size}px`,
                              transform: 'translate(-50%, -50%)'
                            }}
                          >
                            <div 
                              className={cn(
                                "w-full h-full rounded-full flex items-center justify-center shadow-lg",
                                country.hasFranchise 
                                  ? country.status === "healthy" 
                                    ? "bg-emerald-500 shadow-emerald-500/50" 
                                    : country.status === "warning"
                                    ? "bg-amber-500 shadow-amber-500/50"
                                    : "bg-red-500 shadow-red-500/50"
                                  : "bg-slate-600 shadow-slate-500/30"
                              )}
                            >
                              {country.hasFranchise && (
                                <Building className="w-3 h-3 text-white" />
                              )}
                            </div>
                            {country.hasFranchise && country.status === "healthy" && (
                              <motion.div
                                className="absolute inset-0 rounded-full bg-emerald-500/30"
                                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              />
                            )}
                          </motion.div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="bg-slate-800 border-slate-600">
                          <div className="p-2 space-y-1">
                            <p className="font-bold text-white">{country.name}</p>
                            <p className="text-xs text-slate-400">Admin: {country.admin}</p>
                            <div className="flex items-center gap-2 text-xs">
                              <span className="text-emerald-400">{country.franchises} Franchises</span>
                              <span className="text-blue-400">{country.resellers} Resellers</span>
                            </div>
                            <p className="text-xs text-amber-400">{country.leads} Active Leads</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}

                  {/* Legend */}
                  <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-sm rounded-lg p-3 border border-slate-700/50">
                    <p className="text-xs font-medium text-white mb-2">Legend</p>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500" />
                        <span className="text-xs text-slate-300">Healthy</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-amber-500" />
                        <span className="text-xs text-slate-300">Warning</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <span className="text-xs text-slate-300">Critical</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-slate-600" />
                        <span className="text-xs text-slate-300">No Franchise</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats Overlay */}
                  <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-sm rounded-lg p-3 border border-slate-700/50">
                    <p className="text-xs font-medium text-white mb-2">Quick Stats</p>
                    <div className="space-y-1">
                      <p className="text-xs text-slate-300">
                        <span className="text-emerald-400 font-bold">{countriesWithFranchise}</span> Countries with Franchise
                      </p>
                      <p className="text-xs text-slate-300">
                        <span className="text-cyan-400 font-bold">{totalFranchises}</span> Total Franchises
                      </p>
                    </div>
                  </div>

                  {/* Empty State for Antarctica */}
                  {config.countries.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Globe2 className="w-16 h-16 text-slate-600 mx-auto mb-3" />
                        <p className="text-slate-400">No franchise operations in {config.name}</p>
                        <p className="text-xs text-slate-500 mt-1">Research stations only</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Country Detail / Live Activity */}
            <div className="space-y-6">
              {/* Selected Country Detail */}
              <AnimatePresence mode="wait">
                {selectedCountry ? (
                  <motion.div
                    key="detail"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <Card className="bg-slate-900/50 border-slate-700/50">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-white flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-cyan-400" />
                            {selectedCountry.name}
                          </CardTitle>
                          <Button variant="ghost" size="icon" onClick={() => setSelectedCountry(null)}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-400">Status</span>
                          {getStatusBadge(selectedCountry.status)}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-400">Country Admin</span>
                          <span className="text-sm font-medium text-white">{selectedCountry.admin}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                            <p className="text-xl font-bold text-emerald-400">{selectedCountry.franchises}</p>
                            <p className="text-xs text-slate-400">Franchises</p>
                          </div>
                          <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                            <p className="text-xl font-bold text-blue-400">{selectedCountry.resellers}</p>
                            <p className="text-xs text-slate-400">Resellers</p>
                          </div>
                          <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                            <p className="text-xl font-bold text-amber-400">{selectedCountry.leads}</p>
                            <p className="text-xs text-slate-400">Active Leads</p>
                          </div>
                          <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                            <p className="text-xl font-bold text-purple-400">₹{(selectedCountry.revenue / 1000).toFixed(0)}K</p>
                            <p className="text-xs text-slate-400">Revenue</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button className="flex-1" size="sm">View Details</Button>
                          <Button variant="outline" size="sm">View Admin</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Card className="bg-slate-900/50 border-slate-700/50">
                      <CardContent className="p-6 text-center">
                        <Globe2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                        <p className="text-slate-400">Click on a country marker to view details</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Live Activity Feed */}
              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-white text-sm">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    Live Activity
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-auto" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px]">
                    <div className="space-y-2">
                      {liveActivities.map((activity, index) => (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-800/50 transition-colors"
                        >
                          <div className={cn(
                            "w-2 h-2 rounded-full mt-1.5 flex-shrink-0",
                            activity.type === "lead" && "bg-blue-500",
                            activity.type === "franchise" && "bg-emerald-500",
                            activity.type === "demo" && "bg-purple-500",
                            activity.type === "conversion" && "bg-amber-500",
                            activity.type === "alert" && "bg-red-500"
                          )} />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-white truncate">{activity.message}</p>
                            <p className="text-[10px] text-slate-500">{activity.time}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Countries Table */}
          {config.countries.length > 0 && (
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Building className="w-5 h-5 text-purple-400" />
                  Countries Overview ({config.name})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700/50">
                        <th className="text-left text-xs font-medium text-slate-400 py-3 px-4">Country</th>
                        <th className="text-left text-xs font-medium text-slate-400 py-3 px-4">Admin</th>
                        <th className="text-left text-xs font-medium text-slate-400 py-3 px-4">Status</th>
                        <th className="text-right text-xs font-medium text-slate-400 py-3 px-4">Franchises</th>
                        <th className="text-right text-xs font-medium text-slate-400 py-3 px-4">Resellers</th>
                        <th className="text-right text-xs font-medium text-slate-400 py-3 px-4">Leads</th>
                        <th className="text-right text-xs font-medium text-slate-400 py-3 px-4">Revenue</th>
                        <th className="text-right text-xs font-medium text-slate-400 py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCountries.map((country, index) => (
                        <motion.tr
                          key={country.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.03 }}
                          className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors cursor-pointer"
                          onClick={() => setSelectedCountry(country)}
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className={cn("w-2 h-2 rounded-full", getStatusColor(country.status))} />
                              <span className="text-sm font-medium text-white">{country.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-300">{country.admin}</td>
                          <td className="py-3 px-4">{getStatusBadge(country.status)}</td>
                          <td className="py-3 px-4 text-right text-sm text-emerald-400 font-medium">{country.franchises}</td>
                          <td className="py-3 px-4 text-right text-sm text-blue-400 font-medium">{country.resellers}</td>
                          <td className="py-3 px-4 text-right text-sm text-amber-400 font-medium">{country.leads}</td>
                          <td className="py-3 px-4 text-right text-sm text-purple-400 font-medium">₹{(country.revenue / 1000).toFixed(0)}K</td>
                          <td className="py-3 px-4 text-right">
                            <Button variant="ghost" size="sm" className="h-7 px-2">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ContinentDashboard;
