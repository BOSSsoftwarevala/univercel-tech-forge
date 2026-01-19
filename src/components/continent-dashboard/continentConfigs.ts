// Continent Configuration Data for All 6 Continents
import { ContinentConfig, CountryData } from "./types";

// ============ ASIA ============
const asiaCountries: CountryData[] = [
  { id: "IN", name: "India", admin: "Raj Patel", status: "healthy", franchises: 45, resellers: 120, leads: 340, revenue: 2400000, lat: 20.5937, lng: 78.9629, pendingApprovals: 3, issues: 2, compliance: "compliant" },
  { id: "CN", name: "China", admin: "Li Wei", status: "healthy", franchises: 62, resellers: 200, leads: 520, revenue: 4500000, lat: 35.8617, lng: 104.1954, pendingApprovals: 5, issues: 1, compliance: "compliant" },
  { id: "JP", name: "Japan", admin: "Yuki Tanaka", status: "healthy", franchises: 28, resellers: 85, leads: 180, revenue: 1800000, lat: 36.2048, lng: 138.2529, pendingApprovals: 1, issues: 0, compliance: "compliant" },
  { id: "KR", name: "South Korea", admin: "Kim Min-jun", status: "healthy", franchises: 22, resellers: 65, leads: 145, revenue: 1200000, lat: 35.9078, lng: 127.7669, pendingApprovals: 2, issues: 1, compliance: "compliant" },
  { id: "ID", name: "Indonesia", admin: "Budi Santoso", status: "warning", franchises: 18, resellers: 45, leads: 95, revenue: 650000, lat: -0.7893, lng: 113.9213, pendingApprovals: 4, issues: 3, compliance: "review" },
  { id: "TH", name: "Thailand", admin: "Somchai Prasert", status: "healthy", franchises: 15, resellers: 40, leads: 88, revenue: 520000, lat: 15.8700, lng: 100.9925, pendingApprovals: 1, issues: 0, compliance: "compliant" },
  { id: "VN", name: "Vietnam", admin: "Nguyen Van", status: "healthy", franchises: 12, resellers: 35, leads: 72, revenue: 380000, lat: 14.0583, lng: 108.2772, pendingApprovals: 2, issues: 1, compliance: "compliant" },
  { id: "PH", name: "Philippines", admin: "Jose Santos", status: "warning", franchises: 10, resellers: 28, leads: 65, revenue: 290000, lat: 12.8797, lng: 121.7740, pendingApprovals: 3, issues: 2, compliance: "review" },
  { id: "MY", name: "Malaysia", admin: "Ahmad Hassan", status: "healthy", franchises: 14, resellers: 38, leads: 82, revenue: 450000, lat: 4.2105, lng: 101.9758, pendingApprovals: 0, issues: 0, compliance: "compliant" },
  { id: "SG", name: "Singapore", admin: "David Tan", status: "healthy", franchises: 8, resellers: 22, leads: 55, revenue: 380000, lat: 1.3521, lng: 103.8198, pendingApprovals: 1, issues: 0, compliance: "compliant" },
  { id: "AE", name: "UAE", admin: "Ahmed Al-Rashid", status: "healthy", franchises: 12, resellers: 32, leads: 78, revenue: 620000, lat: 23.4241, lng: 53.8478, pendingApprovals: 2, issues: 1, compliance: "compliant" },
  { id: "SA", name: "Saudi Arabia", admin: "Mohammed Al-Saud", status: "critical", franchises: 8, resellers: 18, leads: 42, revenue: 350000, lat: 23.8859, lng: 45.0792, pendingApprovals: 6, issues: 5, compliance: "breach" },
];

// ============ EUROPE ============
const europeCountries: CountryData[] = [
  { id: "GB", name: "United Kingdom", admin: "James Wilson", status: "healthy", franchises: 42, resellers: 95, leads: 280, revenue: 3200000, lat: 55.3781, lng: -3.4360, pendingApprovals: 2, issues: 1, compliance: "compliant" },
  { id: "DE", name: "Germany", admin: "Hans Müller", status: "healthy", franchises: 38, resellers: 88, leads: 245, revenue: 2900000, lat: 51.1657, lng: 10.4515, pendingApprovals: 3, issues: 0, compliance: "compliant" },
  { id: "FR", name: "France", admin: "Pierre Dubois", status: "healthy", franchises: 35, resellers: 78, leads: 210, revenue: 2600000, lat: 46.2276, lng: 2.2137, pendingApprovals: 1, issues: 1, compliance: "compliant" },
  { id: "IT", name: "Italy", admin: "Marco Rossi", status: "warning", franchises: 28, resellers: 65, leads: 175, revenue: 1800000, lat: 41.8719, lng: 12.5674, pendingApprovals: 4, issues: 2, compliance: "review" },
  { id: "ES", name: "Spain", admin: "Carlos García", status: "healthy", franchises: 25, resellers: 58, leads: 155, revenue: 1500000, lat: 40.4637, lng: -3.7492, pendingApprovals: 2, issues: 0, compliance: "compliant" },
  { id: "NL", name: "Netherlands", admin: "Jan De Vries", status: "healthy", franchises: 18, resellers: 42, leads: 98, revenue: 980000, lat: 52.1326, lng: 5.2913, pendingApprovals: 0, issues: 0, compliance: "compliant" },
  { id: "PL", name: "Poland", admin: "Piotr Kowalski", status: "healthy", franchises: 15, resellers: 35, leads: 82, revenue: 650000, lat: 51.9194, lng: 19.1451, pendingApprovals: 1, issues: 1, compliance: "compliant" },
  { id: "SE", name: "Sweden", admin: "Erik Svensson", status: "healthy", franchises: 12, resellers: 28, leads: 65, revenue: 720000, lat: 60.1282, lng: 18.6435, pendingApprovals: 0, issues: 0, compliance: "compliant" },
];

// ============ NORTH AMERICA ============
const northAmericaCountries: CountryData[] = [
  { id: "US", name: "United States", admin: "John Smith", status: "healthy", franchises: 85, resellers: 220, leads: 650, revenue: 8500000, lat: 37.0902, lng: -95.7129, pendingApprovals: 5, issues: 2, compliance: "compliant" },
  { id: "CA", name: "Canada", admin: "Michael Brown", status: "healthy", franchises: 32, resellers: 75, leads: 185, revenue: 2100000, lat: 56.1304, lng: -106.3468, pendingApprovals: 2, issues: 0, compliance: "compliant" },
  { id: "MX", name: "Mexico", admin: "Roberto García", status: "warning", franchises: 22, resellers: 48, leads: 125, revenue: 980000, lat: 23.6345, lng: -102.5528, pendingApprovals: 4, issues: 3, compliance: "review" },
];

// ============ SOUTH AMERICA ============
const southAmericaCountries: CountryData[] = [
  { id: "BR", name: "Brazil", admin: "João Silva", status: "healthy", franchises: 38, resellers: 92, leads: 245, revenue: 2200000, lat: -14.2350, lng: -51.9253, pendingApprovals: 3, issues: 2, compliance: "compliant" },
  { id: "AR", name: "Argentina", admin: "Diego Fernández", status: "healthy", franchises: 22, resellers: 55, leads: 128, revenue: 980000, lat: -38.4161, lng: -63.6167, pendingApprovals: 2, issues: 1, compliance: "compliant" },
  { id: "CO", name: "Colombia", admin: "Carlos Rodríguez", status: "warning", franchises: 15, resellers: 38, leads: 85, revenue: 520000, lat: 4.5709, lng: -74.2973, pendingApprovals: 4, issues: 2, compliance: "review" },
  { id: "CL", name: "Chile", admin: "Pablo Morales", status: "healthy", franchises: 12, resellers: 28, leads: 65, revenue: 450000, lat: -35.6751, lng: -71.5430, pendingApprovals: 1, issues: 0, compliance: "compliant" },
  { id: "PE", name: "Peru", admin: "Luis Castillo", status: "healthy", franchises: 8, resellers: 22, leads: 48, revenue: 280000, lat: -9.1900, lng: -75.0152, pendingApprovals: 1, issues: 1, compliance: "compliant" },
];

// ============ AFRICA ============
const africaCountries: CountryData[] = [
  { id: "ZA", name: "South Africa", admin: "Nelson Mandela Jr", status: "healthy", franchises: 25, resellers: 58, leads: 145, revenue: 1200000, lat: -30.5595, lng: 22.9375, pendingApprovals: 2, issues: 1, compliance: "compliant" },
  { id: "NG", name: "Nigeria", admin: "Chukwuemeka Obi", status: "warning", franchises: 18, resellers: 42, leads: 98, revenue: 680000, lat: 9.0820, lng: 8.6753, pendingApprovals: 5, issues: 3, compliance: "review" },
  { id: "EG", name: "Egypt", admin: "Ahmed Hassan", status: "healthy", franchises: 15, resellers: 35, leads: 82, revenue: 520000, lat: 26.8206, lng: 30.8025, pendingApprovals: 2, issues: 1, compliance: "compliant" },
  { id: "KE", name: "Kenya", admin: "Joseph Kamau", status: "healthy", franchises: 12, resellers: 28, leads: 65, revenue: 380000, lat: -0.0236, lng: 37.9062, pendingApprovals: 1, issues: 0, compliance: "compliant" },
  { id: "MA", name: "Morocco", admin: "Youssef Benali", status: "healthy", franchises: 10, resellers: 22, leads: 52, revenue: 290000, lat: 31.7917, lng: -7.0926, pendingApprovals: 1, issues: 1, compliance: "compliant" },
  { id: "GH", name: "Ghana", admin: "Kwame Asante", status: "critical", franchises: 6, resellers: 15, leads: 35, revenue: 180000, lat: 7.9465, lng: -1.0232, pendingApprovals: 4, issues: 4, compliance: "breach" },
];

// ============ OCEANIA ============
const oceaniaCountries: CountryData[] = [
  { id: "AU", name: "Australia", admin: "James Thompson", status: "healthy", franchises: 35, resellers: 82, leads: 195, revenue: 2800000, lat: -25.2744, lng: 133.7751, pendingApprovals: 2, issues: 1, compliance: "compliant" },
  { id: "NZ", name: "New Zealand", admin: "William Clarke", status: "healthy", franchises: 12, resellers: 28, leads: 65, revenue: 580000, lat: -40.9006, lng: 174.8860, pendingApprovals: 1, issues: 0, compliance: "compliant" },
  { id: "FJ", name: "Fiji", admin: "Ratu Meli", status: "warning", franchises: 4, resellers: 8, leads: 18, revenue: 120000, lat: -17.7134, lng: 178.0650, pendingApprovals: 2, issues: 2, compliance: "review" },
];

// ============ CONTINENT CONFIGURATIONS ============
export const CONTINENT_CONFIGS: Record<string, ContinentConfig> = {
  asia: {
    id: "asia",
    name: "Asia",
    icon: "🌏",
    mapCenter: [100, 25],
    mapScale: 400,
    countries: asiaCountries,
    themeGradient: "from-red-500 to-orange-600",
    accentColor: "red",
  },
  europe: {
    id: "europe",
    name: "Europe",
    icon: "🌍",
    mapCenter: [15, 50],
    mapScale: 600,
    countries: europeCountries,
    themeGradient: "from-blue-500 to-indigo-600",
    accentColor: "blue",
  },
  north_america: {
    id: "north_america",
    name: "North America",
    icon: "🌎",
    mapCenter: [-100, 45],
    mapScale: 350,
    countries: northAmericaCountries,
    themeGradient: "from-cyan-500 to-blue-600",
    accentColor: "cyan",
  },
  south_america: {
    id: "south_america",
    name: "South America",
    icon: "🌎",
    mapCenter: [-60, -15],
    mapScale: 400,
    countries: southAmericaCountries,
    themeGradient: "from-emerald-500 to-teal-600",
    accentColor: "emerald",
  },
  africa: {
    id: "africa",
    name: "Africa",
    icon: "🌍",
    mapCenter: [20, 5],
    mapScale: 400,
    countries: africaCountries,
    themeGradient: "from-amber-500 to-orange-600",
    accentColor: "amber",
  },
  oceania: {
    id: "oceania",
    name: "Australia / Oceania",
    icon: "🌏",
    mapCenter: [140, -25],
    mapScale: 450,
    countries: oceaniaCountries,
    themeGradient: "from-purple-500 to-violet-600",
    accentColor: "purple",
  },
};

export const getContinentConfig = (continentId: string): ContinentConfig => {
  return CONTINENT_CONFIGS[continentId] || CONTINENT_CONFIGS.asia;
};

export const getAllContinents = (): ContinentConfig[] => {
  return Object.values(CONTINENT_CONFIGS);
};
