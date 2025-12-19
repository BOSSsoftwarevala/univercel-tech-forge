import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import {
  Zap,
  Search,
  MapPin,
  Users,
  Monitor,
  TrendingUp,
  ChevronRight,
  Globe,
  Activity,
  Building,
  HeadphonesIcon,
  X,
  Filter,
  Brain,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface Branch {
  id: string;
  name: string;
  code: string;
  coordinates: [number, number];
  region: string;
  continent: string;
  status: "active" | "limited" | "offline";
  franchiseCount: number;
  resellerCount: number;
  developerCount: number;
  demoHealth: number;
  salesPerformance: number;
  supportAvailable: boolean;
  isPredictedGrowth?: boolean;
}

const branches: Branch[] = [
  {
    id: "1",
    name: "Software Vala India HQ",
    code: "IN",
    coordinates: [78.9629, 20.5937],
    region: "South Asia",
    continent: "Asia",
    status: "active",
    franchiseCount: 45,
    resellerCount: 180,
    developerCount: 320,
    demoHealth: 98,
    salesPerformance: 92,
    supportAvailable: true,
  },
  {
    id: "2",
    name: "Software Vala Kenya",
    code: "KE",
    coordinates: [37.9062, -1.2921],
    region: "East Africa",
    continent: "Africa",
    status: "active",
    franchiseCount: 12,
    resellerCount: 45,
    developerCount: 28,
    demoHealth: 95,
    salesPerformance: 78,
    supportAvailable: true,
  },
  {
    id: "3",
    name: "Software Vala UAE",
    code: "AE",
    coordinates: [54.3773, 24.4539],
    region: "Middle East",
    continent: "Asia",
    status: "active",
    franchiseCount: 8,
    resellerCount: 32,
    developerCount: 15,
    demoHealth: 99,
    salesPerformance: 88,
    supportAvailable: true,
  },
  {
    id: "4",
    name: "Software Vala UK",
    code: "GB",
    coordinates: [-0.1276, 51.5074],
    region: "Western Europe",
    continent: "Europe",
    status: "active",
    franchiseCount: 6,
    resellerCount: 24,
    developerCount: 18,
    demoHealth: 97,
    salesPerformance: 85,
    supportAvailable: true,
  },
  {
    id: "5",
    name: "Software Vala USA",
    code: "US",
    coordinates: [-95.7129, 37.0902],
    region: "North America",
    continent: "North America",
    status: "limited",
    franchiseCount: 4,
    resellerCount: 15,
    developerCount: 22,
    demoHealth: 92,
    salesPerformance: 72,
    supportAvailable: true,
  },
  {
    id: "6",
    name: "Software Vala Australia",
    code: "AU",
    coordinates: [133.7751, -25.2744],
    region: "Oceania",
    continent: "Oceania",
    status: "active",
    franchiseCount: 3,
    resellerCount: 12,
    developerCount: 8,
    demoHealth: 96,
    salesPerformance: 80,
    supportAvailable: false,
  },
  {
    id: "7",
    name: "Software Vala Nigeria",
    code: "NG",
    coordinates: [8.6753, 9.082],
    region: "West Africa",
    continent: "Africa",
    status: "active",
    franchiseCount: 7,
    resellerCount: 28,
    developerCount: 35,
    demoHealth: 89,
    salesPerformance: 75,
    supportAvailable: true,
  },
  {
    id: "8",
    name: "Software Vala Singapore",
    code: "SG",
    coordinates: [103.8198, 1.3521],
    region: "Southeast Asia",
    continent: "Asia",
    status: "active",
    franchiseCount: 5,
    resellerCount: 20,
    developerCount: 12,
    demoHealth: 99,
    salesPerformance: 90,
    supportAvailable: true,
  },
  {
    id: "9",
    name: "Software Vala Germany",
    code: "DE",
    coordinates: [10.4515, 51.1657],
    region: "Central Europe",
    continent: "Europe",
    status: "limited",
    franchiseCount: 2,
    resellerCount: 8,
    developerCount: 6,
    demoHealth: 94,
    salesPerformance: 68,
    supportAvailable: false,
  },
  {
    id: "10",
    name: "Software Vala Brazil",
    code: "BR",
    coordinates: [-51.9253, -14.235],
    region: "South America",
    continent: "South America",
    status: "offline",
    franchiseCount: 1,
    resellerCount: 5,
    developerCount: 10,
    demoHealth: 45,
    salesPerformance: 35,
    supportAvailable: false,
    isPredictedGrowth: true,
  },
];

const predictedGrowthRegions: Branch[] = [
  {
    id: "p1",
    name: "Potential: Japan",
    code: "JP",
    coordinates: [138.2529, 36.2048],
    region: "East Asia",
    continent: "Asia",
    status: "offline",
    franchiseCount: 0,
    resellerCount: 0,
    developerCount: 0,
    demoHealth: 0,
    salesPerformance: 0,
    supportAvailable: false,
    isPredictedGrowth: true,
  },
  {
    id: "p2",
    name: "Potential: South Africa",
    code: "ZA",
    coordinates: [22.9375, -30.5595],
    region: "Southern Africa",
    continent: "Africa",
    status: "offline",
    franchiseCount: 0,
    resellerCount: 0,
    developerCount: 0,
    demoHealth: 0,
    salesPerformance: 0,
    supportAvailable: false,
    isPredictedGrowth: true,
  },
  {
    id: "p3",
    name: "Potential: Mexico",
    code: "MX",
    coordinates: [-102.5528, 23.6345],
    region: "Central America",
    continent: "North America",
    status: "offline",
    franchiseCount: 0,
    resellerCount: 0,
    developerCount: 0,
    demoHealth: 0,
    salesPerformance: 0,
    supportAvailable: false,
    isPredictedGrowth: true,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "text-neon-green";
    case "limited":
      return "text-neon-orange";
    case "offline":
      return "text-neon-red";
    default:
      return "text-muted-foreground";
  }
};

const getStatusBg = (status: string) => {
  switch (status) {
    case "active":
      return "bg-neon-green";
    case "limited":
      return "bg-neon-orange";
    case "offline":
      return "bg-neon-red";
    default:
      return "bg-muted";
  }
};

const WorldMapPanel = () => {
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"continent" | "performance" | "franchise">("continent");
  const [aiPredictMode, setAiPredictMode] = useState(false);
  const [position, setPosition] = useState({ coordinates: [20, 10] as [number, number], zoom: 1 });
  const [hoveredBranch, setHoveredBranch] = useState<string | null>(null);

  const allBranches = useMemo(() => {
    if (aiPredictMode) {
      return [...branches, ...predictedGrowthRegions];
    }
    return branches;
  }, [aiPredictMode]);

  const filteredBranches = useMemo(() => {
    let filtered = allBranches.filter(
      (b) =>
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.region.toLowerCase().includes(searchQuery.toLowerCase())
    );

    switch (sortBy) {
      case "performance":
        return filtered.sort((a, b) => b.salesPerformance - a.salesPerformance);
      case "franchise":
        return filtered.sort((a, b) => b.franchiseCount - a.franchiseCount);
      default:
        return filtered.sort((a, b) => a.continent.localeCompare(b.continent));
    }
  }, [allBranches, searchQuery, sortBy]);

  const handleZoomIn = () => {
    if (position.zoom < 4) {
      setPosition((pos) => ({ ...pos, zoom: pos.zoom * 1.5 }));
    }
  };

  const handleZoomOut = () => {
    if (position.zoom > 1) {
      setPosition((pos) => ({ ...pos, zoom: pos.zoom / 1.5 }));
    }
  };

  const handleMoveEnd = (position: { coordinates: [number, number]; zoom: number }) => {
    setPosition(position);
  };

  return (
    <section className="relative w-full min-h-[80vh] bg-background overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-graphite-dark via-background to-sapphire/10" />
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary)/0.5) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--primary)/0.5) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <Globe className="w-7 h-7 text-primary" />
              Global Network
              <Badge className="bg-primary/20 text-primary border border-primary/30">
                {branches.filter(b => b.status === "active").length} Active Regions
              </Badge>
            </h2>
            <div className="h-0.5 w-48 bg-gradient-to-r from-primary via-neon-teal to-transparent mt-2" />
          </div>

          {/* Search Bar */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search country or branch code"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10 bg-card/60 border-border/50 focus:border-primary"
              />
            </div>

            {/* AI Predict Mode Toggle */}
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-card/60 border border-border/30">
              <Brain className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Predict Growth</span>
              <Switch
                checked={aiPredictMode}
                onCheckedChange={setAiPredictMode}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Map Container */}
          <div className="flex-1 relative rounded-xl overflow-hidden border border-border/30 bg-card/30 backdrop-blur-xl">
            {/* Zoom Controls */}
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleZoomIn}
                className="bg-card/80 border-primary/30 hover:bg-primary/10"
              >
                <span className="text-lg font-bold">+</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleZoomOut}
                className="bg-card/80 border-primary/30 hover:bg-primary/10"
              >
                <span className="text-lg font-bold">−</span>
              </Button>
            </div>

            {/* Map */}
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                scale: 140,
              }}
              style={{ width: "100%", height: "600px" }}
            >
              <ZoomableGroup
                zoom={position.zoom}
                center={position.coordinates}
                onMoveEnd={handleMoveEnd}
              >
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill="hsl(var(--secondary))"
                        stroke="hsl(var(--primary) / 0.3)"
                        strokeWidth={0.5}
                        style={{
                          default: { outline: "none" },
                          hover: { 
                            fill: "hsl(var(--primary) / 0.2)", 
                            outline: "none",
                            transition: "all 0.3s",
                          },
                          pressed: { outline: "none" },
                        }}
                      />
                    ))
                  }
                </Geographies>

                {/* Branch Markers */}
                {allBranches.map((branch) => (
                  <Marker
                    key={branch.id}
                    coordinates={branch.coordinates}
                    onMouseEnter={() => setHoveredBranch(branch.id)}
                    onMouseLeave={() => setHoveredBranch(null)}
                    onClick={() => setSelectedBranch(branch)}
                    style={{ cursor: "pointer" }}
                  >
                    {/* Pulse Animation Ring */}
                    <motion.circle
                      r={branch.isPredictedGrowth ? 8 : 12}
                      fill="transparent"
                      stroke={branch.isPredictedGrowth ? "hsl(var(--neon-purple))" : "hsl(var(--primary))"}
                      strokeWidth={1}
                      initial={{ scale: 1, opacity: 0.8 }}
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.8, 0, 0.8],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    
                    {/* Main Dot */}
                    <motion.circle
                      r={hoveredBranch === branch.id ? 8 : 6}
                      fill={
                        branch.isPredictedGrowth
                          ? "hsl(var(--neon-purple))"
                          : branch.status === "active"
                          ? "hsl(var(--neon-green))"
                          : branch.status === "limited"
                          ? "hsl(var(--neon-orange))"
                          : "hsl(var(--neon-red))"
                      }
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      style={{
                        filter: hoveredBranch === branch.id 
                          ? "drop-shadow(0 0 10px hsl(var(--primary)))" 
                          : "drop-shadow(0 0 5px hsl(var(--primary) / 0.5))",
                      }}
                    />
                    
                    {/* Lightning Icon */}
                    <g transform="translate(-4, -4)">
                      <Zap 
                        size={8} 
                        fill="white" 
                        stroke="white"
                        strokeWidth={0}
                      />
                    </g>

                    {/* Region Code */}
                    <text
                      textAnchor="middle"
                      y={-12}
                      style={{
                        fontFamily: "JetBrains Mono, monospace",
                        fontSize: "10px",
                        fill: "hsl(var(--foreground))",
                        fontWeight: "bold",
                        textShadow: "0 0 10px hsl(var(--primary))",
                      }}
                    >
                      {branch.code}
                    </text>
                  </Marker>
                ))}
              </ZoomableGroup>
            </ComposableMap>

            {/* Selected Branch Tooltip */}
            <AnimatePresence>
              {selectedBranch && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  className="absolute bottom-4 left-4 right-4 md:right-auto md:w-96 p-5 rounded-xl bg-card/95 backdrop-blur-xl border border-primary/30 shadow-xl shadow-primary/10"
                >
                  <button
                    onClick={() => setSelectedBranch(null)}
                    className="absolute top-3 right-3 p-1 rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                      <Zap className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{selectedBranch.name}</h3>
                      <p className="text-sm text-muted-foreground">{selectedBranch.region}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`w-2 h-2 rounded-full ${getStatusBg(selectedBranch.status)}`} />
                        <span className={`text-xs capitalize ${getStatusColor(selectedBranch.status)}`}>
                          {selectedBranch.status}
                        </span>
                        {selectedBranch.supportAvailable && (
                          <Badge className="bg-neon-green/20 text-neon-green border-0 text-xs ml-2">
                            <HeadphonesIcon className="w-3 h-3 mr-1" />
                            Support Live
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {!selectedBranch.isPredictedGrowth && (
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div className="p-3 rounded-lg bg-secondary/30 border border-border/30">
                        <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                          <Building className="w-3 h-3" />
                          Franchises
                        </div>
                        <p className="text-lg font-bold text-foreground">{selectedBranch.franchiseCount}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-secondary/30 border border-border/30">
                        <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                          <Users className="w-3 h-3" />
                          Resellers
                        </div>
                        <p className="text-lg font-bold text-foreground">{selectedBranch.resellerCount}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-secondary/30 border border-border/30">
                        <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                          <Monitor className="w-3 h-3" />
                          Demo Health
                        </div>
                        <p className={`text-lg font-bold ${selectedBranch.demoHealth > 90 ? "text-neon-green" : selectedBranch.demoHealth > 70 ? "text-neon-orange" : "text-neon-red"}`}>
                          {selectedBranch.demoHealth}%
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-secondary/30 border border-border/30">
                        <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                          <TrendingUp className="w-3 h-3" />
                          Sales
                        </div>
                        <p className={`text-lg font-bold ${selectedBranch.salesPerformance > 80 ? "text-neon-green" : selectedBranch.salesPerformance > 60 ? "text-neon-orange" : "text-neon-red"}`}>
                          {selectedBranch.salesPerformance}%
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedBranch.isPredictedGrowth && (
                    <div className="mt-4 p-3 rounded-lg bg-neon-purple/10 border border-neon-purple/30">
                      <div className="flex items-center gap-2 text-neon-purple">
                        <Brain className="w-4 h-4" />
                        <span className="text-sm font-medium">AI Predicted Growth Region</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        High potential market identified for expansion based on demographic and market analysis.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Legend */}
            <div className="absolute top-4 right-4 p-3 rounded-lg bg-card/80 backdrop-blur-xl border border-border/30">
              <p className="text-xs font-semibold text-muted-foreground mb-2">STATUS</p>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-neon-green" />
                  <span className="text-xs text-muted-foreground">Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-neon-orange" />
                  <span className="text-xs text-muted-foreground">Limited</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-neon-red" />
                  <span className="text-xs text-muted-foreground">Offline</span>
                </div>
                {aiPredictMode && (
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-neon-purple" />
                    <span className="text-xs text-muted-foreground">Predicted</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="hidden xl:block w-80">
            <div className="sticky top-4 p-4 rounded-xl bg-card/60 backdrop-blur-xl border border-border/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  REGIONS
                </h3>
                <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                  <SelectTrigger className="w-32 h-8 bg-secondary/30 border-border/50 text-xs">
                    <Filter className="w-3 h-3 mr-1" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="continent">Continent</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                    <SelectItem value="franchise">Franchise</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <ScrollArea className="h-[500px] pr-2">
                <div className="space-y-2">
                  {filteredBranches.map((branch) => (
                    <motion.div
                      key={branch.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedBranch(branch)}
                      className={`
                        p-3 rounded-lg cursor-pointer transition-all border
                        ${selectedBranch?.id === branch.id 
                          ? "bg-primary/10 border-primary/50" 
                          : "bg-secondary/30 border-border/30 hover:border-primary/30"}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`
                          w-8 h-8 rounded-lg flex items-center justify-center
                          ${branch.isPredictedGrowth 
                            ? "bg-neon-purple/20 border border-neon-purple/30" 
                            : "bg-primary/10 border border-primary/30"}
                        `}>
                          <span className="text-xs font-bold text-foreground">{branch.code}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{branch.name.replace("Software Vala ", "")}</p>
                          <p className="text-xs text-muted-foreground">{branch.region}</p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className={`w-2 h-2 rounded-full ${getStatusBg(branch.status)}`} />
                          {!branch.isPredictedGrowth && (
                            <span className="text-xs text-muted-foreground mt-1">
                              {branch.developerCount} devs
                            </span>
                          )}
                        </div>
                      </div>

                      {!branch.isPredictedGrowth && (
                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-primary to-neon-teal rounded-full"
                              style={{ width: `${branch.salesPerformance}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">{branch.salesPerformance}%</span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>

              {/* Summary Stats */}
              <div className="mt-4 pt-4 border-t border-border/30 grid grid-cols-2 gap-2">
                <div className="p-2 rounded-lg bg-secondary/30 text-center">
                  <p className="text-lg font-bold text-foreground">
                    {branches.reduce((acc, b) => acc + b.developerCount, 0)}
                  </p>
                  <p className="text-xs text-muted-foreground">Total Devs</p>
                </div>
                <div className="p-2 rounded-lg bg-secondary/30 text-center">
                  <p className="text-lg font-bold text-foreground">
                    {branches.reduce((acc, b) => acc + b.franchiseCount, 0)}
                  </p>
                  <p className="text-xs text-muted-foreground">Franchises</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorldMapPanel;
