// Continent Dashboard Types & Configuration

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
  pendingApprovals: number;
  issues: number;
  compliance: "compliant" | "review" | "breach";
}

export interface MapMarker {
  id: string;
  type: "franchise" | "reseller" | "influencer" | "issue" | "pending";
  name: string;
  country: string;
  lat: number;
  lng: number;
  status: string;
  details: string;
}

export interface ActionKPI {
  id: string;
  title: string;
  count: number;
  icon: any;
  color: string;
  trend: "up" | "down" | "stable";
  source: "Human" | "AI" | "System";
  lastUpdate: string;
  actions: string[];
}

export interface ContinentConfig {
  id: string;
  name: string;
  icon: string;
  mapCenter: [number, number];
  mapScale: number;
  countries: CountryData[];
  themeGradient: string;
  accentColor: string;
}

// Marker color mapping
export const MARKER_COLORS = {
  franchise: "#3b82f6",    // Blue
  reseller: "#22c55e",     // Green
  influencer: "#eab308",   // Yellow
  issue: "#ef4444",        // Red
  pending: "#f97316",      // Orange
};

// Generate map markers from country data
export const generateMarkers = (countries: CountryData[]): MapMarker[] => {
  const markers: MapMarker[] = [];
  
  countries.forEach(country => {
    // Add franchise markers (limited for performance)
    for (let i = 0; i < Math.min(country.franchises, 3); i++) {
      markers.push({
        id: `${country.id}-fr-${i}`,
        type: "franchise",
        name: `${country.name} Franchise ${i + 1}`,
        country: country.name,
        lat: country.lat + (Math.random() - 0.5) * 5,
        lng: country.lng + (Math.random() - 0.5) * 5,
        status: country.status,
        details: `Revenue: $${Math.floor(country.revenue / country.franchises).toLocaleString()}`
      });
    }
    
    // Add reseller markers
    for (let i = 0; i < Math.min(country.resellers, 2); i++) {
      markers.push({
        id: `${country.id}-rs-${i}`,
        type: "reseller",
        name: `${country.name} Reseller ${i + 1}`,
        country: country.name,
        lat: country.lat + (Math.random() - 0.5) * 6,
        lng: country.lng + (Math.random() - 0.5) * 6,
        status: "active",
        details: `Leads: ${Math.floor(country.leads / 3)}`
      });
    }
    
    // Add issue markers
    if (country.issues > 0) {
      markers.push({
        id: `${country.id}-issue`,
        type: "issue",
        name: `Issue in ${country.name}`,
        country: country.name,
        lat: country.lat + 1,
        lng: country.lng + 1,
        status: "critical",
        details: `${country.issues} open issues`
      });
    }
    
    // Add pending approval markers
    if (country.pendingApprovals > 0) {
      markers.push({
        id: `${country.id}-pending`,
        type: "pending",
        name: `Pending: ${country.name}`,
        country: country.name,
        lat: country.lat - 1,
        lng: country.lng - 1,
        status: "pending",
        details: `${country.pendingApprovals} pending approvals`
      });
    }
  });
  
  return markers;
};
