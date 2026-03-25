import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Globe, MapPin, Users, Building2, AlertTriangle,
  CheckCircle, Edit2, Search
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const TerritoryRegionMap = () => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>("nigeria");
  const [searchTerm, setSearchTerm] = useState("");

  const territories = [
    {
      country: "nigeria",
      name: "Nigeria",
      franchise: "NG Master Franchise",
      franchiseId: "FR-NG-001",
      leads: 234,
      states: [
        { name: "Lagos", reseller: "Lagos Prime Sales", leads: 89, coverage: 95 },
        { name: "Abuja", reseller: "Capital Tech Sales", leads: 67, coverage: 88 },
        { name: "Kano", reseller: "North Region Sales", leads: 45, coverage: 72 },
        { name: "Port Harcourt", reseller: "Rivers Sales Team", leads: 33, coverage: 65 },
      ]
    },
    {
      country: "india",
      name: "India",
      franchise: "IN Master Franchise",
      franchiseId: "FR-IN-001",
      leads: 456,
      states: [
        { name: "Maharashtra", reseller: "Mumbai Sales Hub", leads: 156, coverage: 92 },
        { name: "Karnataka", reseller: "Bangalore Tech Sales", leads: 134, coverage: 88 },
        { name: "Delhi NCR", reseller: "North India Sales", leads: 98, coverage: 85 },
        { name: "Tamil Nadu", reseller: "Chennai Sales Team", leads: 68, coverage: 78 },
      ]
    },
    {
      country: "uae",
      name: "UAE",
      franchise: "UAE Master Franchise",
      franchiseId: "FR-AE-001",
      leads: 123,
      states: [
        { name: "Dubai", reseller: "Dubai Premium Sales", leads: 78, coverage: 98 },
        { name: "Abu Dhabi", reseller: "Capital Sales Team", leads: 32, coverage: 90 },
        { name: "Sharjah", reseller: "Northern Emirates", leads: 13, coverage: 75 },
      ]
    },
    {
      country: "kenya",
      name: "Kenya",
      franchise: "KE Master Franchise",
      franchiseId: "FR-KE-001",
      leads: 89,
      states: [
        { name: "Nairobi", reseller: "Nairobi Central", leads: 54, coverage: 88 },
        { name: "Mombasa", reseller: "Coastal Sales", leads: 23, coverage: 72 },
        { name: "Kisumu", reseller: "Western Kenya", leads: 12, coverage: 55 },
      ]
    },
  ];

  const selectedTerritory = territories.find(t => t.country === selectedCountry);

  const conflictAlerts = [
    { region: "Lagos - Ikeja", issue: "Overlapping reseller coverage", severity: "warning" },
    { region: "Mumbai - Andheri", issue: "Unassigned territory", severity: "error" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Globe className="w-6 h-6 text-indigo-400" />
            Territory & Region Mapping
          </h2>
          <p className="text-slate-400">Lead routing based on geographic territories</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search territories..."
              className="pl-10 bg-slate-800/50 border-slate-600 w-64"
            />
          </div>
          <Button className="bg-gradient-to-r from-indigo-500 to-purple-500">
            <Edit2 className="w-4 h-4 mr-2" />
            Manage Territories
          </Button>
        </div>
      </div>

      {/* Conflict Alerts */}
      {conflictAlerts.length > 0 && (
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
            <h4 className="font-semibold text-orange-400">Territory Conflicts Detected</h4>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {conflictAlerts.map((alert, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  alert.severity === "error" ? "bg-red-500/10 border border-red-500/20" : "bg-orange-500/10 border border-orange-500/20"
                }`}
              >
                <p className="text-white font-medium">{alert.region}</p>
                <p className="text-xs text-slate-400">{alert.issue}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* Country List */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4">
          <h3 className="font-semibold text-white mb-4">Countries</h3>
          <div className="space-y-2">
            {territories.map((territory) => (
              <motion.button
                key={territory.country}
                whileHover={{ x: 5 }}
                onClick={() => setSelectedCountry(territory.country)}
                className={`w-full p-3 rounded-lg flex items-center justify-between transition-all ${
                  selectedCountry === territory.country
                    ? "bg-indigo-500/20 border border-indigo-500/50"
                    : "bg-slate-800/50 border border-transparent hover:border-slate-600"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-sm font-bold">
                    {territory.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-white">{territory.name}</p>
                    <p className="text-xs text-slate-400">{territory.franchise}</p>
                  </div>
                </div>
                <Badge className="bg-indigo-500/20 text-indigo-400">
                  {territory.leads}
                </Badge>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Selected Territory Details */}
        <div className="col-span-2 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4">
          {selectedTerritory ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-white text-xl">{selectedTerritory.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className="bg-purple-500/20 text-purple-400">
                      <Building2 className="w-3 h-3 mr-1" />
                      {selectedTerritory.franchise}
                    </Badge>
                    <span className="text-xs text-slate-500">ID: {selectedTerritory.franchiseId}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-white">{selectedTerritory.leads}</p>
                  <p className="text-xs text-slate-400">Total Leads</p>
                </div>
              </div>

              {/* States/Regions */}
              <h4 className="text-sm font-medium text-slate-400 mb-3">States / Regions</h4>
              <div className="space-y-3">
                {selectedTerritory.states.map((state, index) => (
                  <motion.div
                    key={state.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 bg-slate-800/50 rounded-xl"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-indigo-400" />
                        <div>
                          <p className="font-medium text-white">{state.name}</p>
                          <p className="text-xs text-slate-400 flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {state.reseller}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-lg font-bold text-white">{state.leads}</p>
                          <p className="text-xs text-slate-400">Leads</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-400">{state.coverage}%</p>
                          <p className="text-xs text-slate-400">Coverage</p>
                        </div>
                      </div>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${state.coverage}%` }}
                        className={`h-full rounded-full ${
                          state.coverage >= 80 ? "bg-green-500" :
                          state.coverage >= 60 ? "bg-yellow-500" : "bg-red-500"
                        }`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-64 text-slate-500">
              Select a country to view territory details
            </div>
          )}
        </div>
      </div>

      {/* Routing Rules */}
      <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4">
        <h4 className="font-semibold text-white mb-3">Auto-Routing Rules</h4>
        <div className="grid grid-cols-4 gap-3">
          <div className="p-3 bg-slate-800/50 rounded-lg">
            <p className="text-indigo-400 font-medium">Country → Franchise</p>
            <p className="text-xs text-slate-400">Routes to master franchise holder</p>
          </div>
          <div className="p-3 bg-slate-800/50 rounded-lg">
            <p className="text-purple-400 font-medium">State → Sub-Franchise</p>
            <p className="text-xs text-slate-400">Routes to regional franchise</p>
          </div>
          <div className="p-3 bg-slate-800/50 rounded-lg">
            <p className="text-pink-400 font-medium">City → Reseller</p>
            <p className="text-xs text-slate-400">Routes to local sales team</p>
          </div>
          <div className="p-3 bg-slate-800/50 rounded-lg">
            <p className="text-green-400 font-medium">Conflict Prevention</p>
            <p className="text-xs text-slate-400">No overlap allowed in territories</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerritoryRegionMap;
