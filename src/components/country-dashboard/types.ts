// Country Dashboard Types

export interface CountryEntity {
  id: string;
  name: string;
  type: "franchise" | "reseller" | "influencer" | "issue";
  status: "active" | "pending" | "warning" | "critical";
  city: string;
  region: string;
  lat: number;
  lng: number;
  revenue: number;
  openIssues: number;
  lastActivity: string;
}

export interface RegionData {
  id: string;
  name: string;
  cities: number;
  managers: number;
  status: "active" | "maintenance" | "warning" | "critical";
  performance: number;
  franchises: number;
  resellers: number;
  influencers: number;
  pendingApprovals: number;
  openIssues: number;
  revenue: number;
  lat: number;
  lng: number;
}

export interface CountryActionKPI {
  id: string;
  title: string;
  count: number;
  icon: any;
  color: string;
  trend?: "up" | "down" | "stable";
  source: "human" | "ai" | "system";
  lastUpdate: string;
}

export interface CountryConfig {
  code: string;
  name: string;
  flag: string;
  continent: string;
  mapCenter: [number, number];
  mapZoom: number;
  themeGradient: string;
  accentColor: string;
  regions: RegionData[];
}

// Marker color constants
export const MARKER_COLORS = {
  franchise_active: "#22c55e",    // Green
  franchise_pending: "#eab308",   // Yellow/Amber
  reseller_active: "#3b82f6",     // Blue
  influencer: "#f97316",          // Orange
  pending_approval: "#f59e0b",    // Amber
  issue: "#ef4444",               // Red
  region_healthy: "#10b981",      // Emerald
  region_warning: "#f59e0b",      // Amber
  region_critical: "#ef4444",     // Red
};

// Generate entities for a country
export const generateCountryEntities = (regions: RegionData[]): CountryEntity[] => {
  const entities: CountryEntity[] = [];
  
  regions.forEach((region) => {
    // Add franchises
    for (let i = 0; i < Math.min(region.franchises, 3); i++) {
      entities.push({
        id: `${region.id}-franchise-${i}`,
        name: `${region.name} Franchise ${i + 1}`,
        type: "franchise",
        status: i === 0 && region.pendingApprovals > 0 ? "pending" : "active",
        city: `City ${i + 1}`,
        region: region.name,
        lat: region.lat + (Math.random() - 0.5) * 2,
        lng: region.lng + (Math.random() - 0.5) * 2,
        revenue: Math.floor(Math.random() * 500000) + 100000,
        openIssues: Math.floor(Math.random() * 3),
        lastActivity: `${Math.floor(Math.random() * 60)} min ago`,
      });
    }
    
    // Add resellers
    for (let i = 0; i < Math.min(region.resellers, 2); i++) {
      entities.push({
        id: `${region.id}-reseller-${i}`,
        name: `${region.name} Reseller ${i + 1}`,
        type: "reseller",
        status: "active",
        city: `Town ${i + 1}`,
        region: region.name,
        lat: region.lat + (Math.random() - 0.5) * 3,
        lng: region.lng + (Math.random() - 0.5) * 3,
        revenue: Math.floor(Math.random() * 200000) + 50000,
        openIssues: Math.floor(Math.random() * 2),
        lastActivity: `${Math.floor(Math.random() * 120)} min ago`,
      });
    }
    
    // Add influencers
    for (let i = 0; i < Math.min(region.influencers, 2); i++) {
      entities.push({
        id: `${region.id}-influencer-${i}`,
        name: `${region.name} Influencer ${i + 1}`,
        type: "influencer",
        status: Math.random() > 0.7 ? "warning" : "active",
        city: `Digital Hub ${i + 1}`,
        region: region.name,
        lat: region.lat + (Math.random() - 0.5) * 2.5,
        lng: region.lng + (Math.random() - 0.5) * 2.5,
        revenue: Math.floor(Math.random() * 100000) + 20000,
        openIssues: Math.floor(Math.random() * 4),
        lastActivity: `${Math.floor(Math.random() * 240)} min ago`,
      });
    }
    
    // Add issues if any
    if (region.openIssues > 0) {
      entities.push({
        id: `${region.id}-issue-1`,
        name: `${region.name} Alert`,
        type: "issue",
        status: "critical",
        city: region.name,
        region: region.name,
        lat: region.lat,
        lng: region.lng,
        revenue: 0,
        openIssues: region.openIssues,
        lastActivity: "10 min ago",
      });
    }
  });
  
  return entities;
};

// Sample country configurations
export const countryConfigs: Record<string, CountryConfig> = {
  IN: {
    code: "IN",
    name: "India",
    flag: "🇮🇳",
    continent: "Asia",
    mapCenter: [78.9629, 20.5937],
    mapZoom: 4,
    themeGradient: "from-orange-500 to-green-500",
    accentColor: "orange",
    regions: [
      { id: "north", name: "North Region", cities: 12, managers: 4, status: "active", performance: 88, franchises: 8, resellers: 12, influencers: 6, pendingApprovals: 3, openIssues: 2, revenue: 2500000, lat: 28.7, lng: 77.1 },
      { id: "south", name: "South Region", cities: 8, managers: 3, status: "active", performance: 92, franchises: 6, resellers: 10, influencers: 5, pendingApprovals: 1, openIssues: 0, revenue: 2200000, lat: 13.0, lng: 77.5 },
      { id: "east", name: "East Region", cities: 10, managers: 3, status: "active", performance: 85, franchises: 5, resellers: 8, influencers: 4, pendingApprovals: 2, openIssues: 1, revenue: 1800000, lat: 22.5, lng: 88.3 },
      { id: "west", name: "West Region", cities: 15, managers: 5, status: "active", performance: 90, franchises: 10, resellers: 15, influencers: 8, pendingApprovals: 4, openIssues: 1, revenue: 3200000, lat: 19.0, lng: 72.8 },
      { id: "central", name: "Central Region", cities: 6, managers: 2, status: "maintenance", performance: 75, franchises: 3, resellers: 5, influencers: 2, pendingApprovals: 5, openIssues: 3, revenue: 900000, lat: 23.2, lng: 79.9 },
    ],
  },
  US: {
    code: "US",
    name: "United States",
    flag: "🇺🇸",
    continent: "North America",
    mapCenter: [-95.7129, 37.0902],
    mapZoom: 3.5,
    themeGradient: "from-blue-600 to-red-500",
    accentColor: "blue",
    regions: [
      { id: "northeast", name: "Northeast", cities: 20, managers: 6, status: "active", performance: 91, franchises: 15, resellers: 25, influencers: 12, pendingApprovals: 4, openIssues: 2, revenue: 5500000, lat: 40.7, lng: -74.0 },
      { id: "southeast", name: "Southeast", cities: 18, managers: 5, status: "active", performance: 88, franchises: 12, resellers: 20, influencers: 10, pendingApprovals: 3, openIssues: 1, revenue: 4200000, lat: 33.7, lng: -84.3 },
      { id: "midwest", name: "Midwest", cities: 15, managers: 4, status: "active", performance: 86, franchises: 10, resellers: 18, influencers: 8, pendingApprovals: 2, openIssues: 1, revenue: 3800000, lat: 41.8, lng: -87.6 },
      { id: "southwest", name: "Southwest", cities: 12, managers: 4, status: "active", performance: 89, franchises: 8, resellers: 15, influencers: 7, pendingApprovals: 3, openIssues: 0, revenue: 3200000, lat: 33.4, lng: -112.0 },
      { id: "west", name: "West Coast", cities: 14, managers: 5, status: "active", performance: 93, franchises: 18, resellers: 22, influencers: 15, pendingApprovals: 5, openIssues: 1, revenue: 6200000, lat: 34.0, lng: -118.2 },
    ],
  },
  DE: {
    code: "DE",
    name: "Germany",
    flag: "🇩🇪",
    continent: "Europe",
    mapCenter: [10.4515, 51.1657],
    mapZoom: 5,
    themeGradient: "from-yellow-400 to-red-600",
    accentColor: "yellow",
    regions: [
      { id: "north", name: "North Germany", cities: 8, managers: 3, status: "active", performance: 90, franchises: 6, resellers: 10, influencers: 5, pendingApprovals: 2, openIssues: 0, revenue: 1800000, lat: 53.5, lng: 10.0 },
      { id: "south", name: "South Germany", cities: 10, managers: 4, status: "active", performance: 94, franchises: 8, resellers: 12, influencers: 6, pendingApprovals: 1, openIssues: 0, revenue: 2400000, lat: 48.1, lng: 11.5 },
      { id: "west", name: "West Germany", cities: 12, managers: 4, status: "active", performance: 88, franchises: 10, resellers: 15, influencers: 8, pendingApprovals: 3, openIssues: 1, revenue: 2800000, lat: 51.2, lng: 6.7 },
      { id: "east", name: "East Germany", cities: 6, managers: 2, status: "maintenance", performance: 82, franchises: 4, resellers: 6, influencers: 3, pendingApprovals: 4, openIssues: 2, revenue: 1200000, lat: 52.5, lng: 13.4 },
    ],
  },
  NG: {
    code: "NG",
    name: "Nigeria",
    flag: "🇳🇬",
    continent: "Africa",
    mapCenter: [8.6753, 9.082],
    mapZoom: 5,
    themeGradient: "from-green-600 to-green-800",
    accentColor: "green",
    regions: [
      { id: "north", name: "North Nigeria", cities: 10, managers: 3, status: "active", performance: 78, franchises: 5, resellers: 8, influencers: 4, pendingApprovals: 3, openIssues: 2, revenue: 1200000, lat: 12.0, lng: 8.5 },
      { id: "south", name: "South Nigeria", cities: 12, managers: 4, status: "active", performance: 85, franchises: 8, resellers: 12, influencers: 6, pendingApprovals: 2, openIssues: 1, revenue: 1800000, lat: 6.5, lng: 3.3 },
      { id: "east", name: "East Nigeria", cities: 8, managers: 3, status: "warning", performance: 72, franchises: 4, resellers: 6, influencers: 3, pendingApprovals: 4, openIssues: 3, revenue: 900000, lat: 5.5, lng: 7.0 },
      { id: "west", name: "West Nigeria", cities: 9, managers: 3, status: "active", performance: 80, franchises: 6, resellers: 10, influencers: 5, pendingApprovals: 2, openIssues: 1, revenue: 1400000, lat: 7.3, lng: 3.9 },
    ],
  },
  AU: {
    code: "AU",
    name: "Australia",
    flag: "🇦🇺",
    continent: "Oceania",
    mapCenter: [133.7751, -25.2744],
    mapZoom: 3.5,
    themeGradient: "from-blue-500 to-yellow-500",
    accentColor: "blue",
    regions: [
      { id: "nsw", name: "New South Wales", cities: 10, managers: 4, status: "active", performance: 92, franchises: 12, resellers: 18, influencers: 9, pendingApprovals: 2, openIssues: 0, revenue: 2800000, lat: -33.8, lng: 151.2 },
      { id: "vic", name: "Victoria", cities: 8, managers: 3, status: "active", performance: 90, franchises: 10, resellers: 15, influencers: 8, pendingApprovals: 3, openIssues: 1, revenue: 2400000, lat: -37.8, lng: 144.9 },
      { id: "qld", name: "Queensland", cities: 7, managers: 3, status: "active", performance: 88, franchises: 8, resellers: 12, influencers: 6, pendingApprovals: 2, openIssues: 0, revenue: 1800000, lat: -27.4, lng: 153.0 },
      { id: "wa", name: "Western Australia", cities: 5, managers: 2, status: "maintenance", performance: 80, franchises: 4, resellers: 6, influencers: 3, pendingApprovals: 4, openIssues: 2, revenue: 1000000, lat: -31.9, lng: 115.8 },
    ],
  },
  BR: {
    code: "BR",
    name: "Brazil",
    flag: "🇧🇷",
    continent: "South America",
    mapCenter: [-51.9253, -14.235],
    mapZoom: 3.5,
    themeGradient: "from-green-500 to-yellow-400",
    accentColor: "green",
    regions: [
      { id: "southeast", name: "Southeast Brazil", cities: 15, managers: 5, status: "active", performance: 89, franchises: 12, resellers: 20, influencers: 10, pendingApprovals: 3, openIssues: 1, revenue: 3500000, lat: -23.5, lng: -46.6 },
      { id: "south", name: "South Brazil", cities: 10, managers: 4, status: "active", performance: 91, franchises: 8, resellers: 14, influencers: 7, pendingApprovals: 2, openIssues: 0, revenue: 2200000, lat: -25.4, lng: -49.2 },
      { id: "northeast", name: "Northeast Brazil", cities: 12, managers: 4, status: "active", performance: 82, franchises: 6, resellers: 10, influencers: 5, pendingApprovals: 4, openIssues: 2, revenue: 1600000, lat: -8.0, lng: -34.8 },
      { id: "north", name: "North Brazil", cities: 6, managers: 2, status: "warning", performance: 75, franchises: 3, resellers: 5, influencers: 2, pendingApprovals: 5, openIssues: 3, revenue: 800000, lat: -3.1, lng: -60.0 },
      { id: "central", name: "Central-West Brazil", cities: 8, managers: 3, status: "active", performance: 85, franchises: 5, resellers: 8, influencers: 4, pendingApprovals: 2, openIssues: 1, revenue: 1400000, lat: -15.7, lng: -47.9 },
    ],
  },
};
