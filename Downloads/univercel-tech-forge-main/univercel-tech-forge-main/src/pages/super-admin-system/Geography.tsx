import { useState } from "react";
import { motion } from "framer-motion";
import { Globe, MapPin, ChevronRight, Power, UserCog, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import SuperAdminWireframeLayout from "@/components/super-admin-wireframe/SuperAdminWireframeLayout";

interface Continent {
  id: string;
  name: string;
  status: "enabled" | "disabled";
  countryCount: number;
  userCount: number;
}

interface Country {
  id: string;
  name: string;
  continentId: string;
  status: "enabled" | "disabled";
  assignedAdmin: string | null;
  userCount: number;
}

const continents: Continent[] = [
  { id: "C001", name: "Africa", status: "enabled", countryCount: 54, userCount: 12500 },
  { id: "C002", name: "Europe", status: "enabled", countryCount: 44, userCount: 8900 },
  { id: "C003", name: "Asia", status: "enabled", countryCount: 48, userCount: 15600 },
  { id: "C004", name: "Americas", status: "enabled", countryCount: 35, userCount: 7800 },
  { id: "C005", name: "Oceania", status: "disabled", countryCount: 14, userCount: 2100 },
];

const countries: Country[] = [
  { id: "CO001", name: "Nigeria", continentId: "C001", status: "enabled", assignedAdmin: "ADM-001", userCount: 4500 },
  { id: "CO002", name: "Kenya", continentId: "C001", status: "enabled", assignedAdmin: "ADM-002", userCount: 2800 },
  { id: "CO003", name: "South Africa", continentId: "C001", status: "enabled", assignedAdmin: null, userCount: 3200 },
  { id: "CO004", name: "Egypt", continentId: "C001", status: "disabled", assignedAdmin: null, userCount: 1200 },
  { id: "CO005", name: "Ghana", continentId: "C001", status: "enabled", assignedAdmin: "ADM-003", userCount: 800 },
  { id: "CO006", name: "United Kingdom", continentId: "C002", status: "enabled", assignedAdmin: "ADM-004", userCount: 3500 },
  { id: "CO007", name: "Germany", continentId: "C002", status: "enabled", assignedAdmin: "ADM-005", userCount: 2100 },
  { id: "CO008", name: "France", continentId: "C002", status: "enabled", assignedAdmin: null, userCount: 1800 },
];

const SuperAdminGeography = () => {
  const [selectedContinent, setSelectedContinent] = useState<Continent | null>(null);
  const [continentStates, setContinentStates] = useState<Record<string, boolean>>(
    Object.fromEntries(continents.map(c => [c.id, c.status === "enabled"]))
  );
  const [countryStates, setCountryStates] = useState<Record<string, boolean>>(
    Object.fromEntries(countries.map(c => [c.id, c.status === "enabled"]))
  );

  const toggleContinent = (id: string) => {
    setContinentStates(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleCountry = (id: string) => {
    setCountryStates(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredCountries = selectedContinent
    ? countries.filter(c => c.continentId === selectedContinent.id)
    : [];

  return (
    <SuperAdminWireframeLayout activeSection="geography">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Geography Management</h1>
          <p className="text-muted-foreground">Manage regions and assign administrators</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Continents */}
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                Continents
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {continents.map((continent, index) => (
                <motion.div
                  key={continent.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedContinent(continent)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 flex items-center justify-between ${
                    selectedContinent?.id === continent.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${continentStates[continent.id] ? "bg-neon-green" : "bg-muted-foreground"}`} />
                    <div>
                      <h4 className="font-medium">{continent.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {continent.countryCount} countries • {continent.userCount.toLocaleString()} users
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={continentStates[continent.id]}
                      onCheckedChange={() => toggleContinent(continent.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Countries */}
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Countries
                {selectedContinent && (
                  <Badge variant="outline" className="ml-2">{selectedContinent.name}</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedContinent ? (
                <div className="space-y-3">
                  {filteredCountries.map((country, index) => (
                    <motion.div
                      key={country.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 rounded-lg border border-border hover:border-primary/50 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${countryStates[country.id] ? "bg-neon-green" : "bg-muted-foreground"}`} />
                          <h4 className="font-medium">{country.name}</h4>
                        </div>
                        <Switch
                          checked={countryStates[country.id]}
                          onCheckedChange={() => toggleCountry(country.id)}
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {country.userCount.toLocaleString()} users
                        </span>
                        {country.assignedAdmin ? (
                          <Badge variant="outline" className="text-xs">
                            <UserCog className="w-3 h-3 mr-1" />
                            {country.assignedAdmin}
                          </Badge>
                        ) : (
                          <Button variant="outline" size="sm" className="text-xs h-7">
                            <UserCog className="w-3 h-3 mr-1" />
                            Assign Admin
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <Globe className="w-12 h-12 text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground">Select a continent to view countries</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </SuperAdminWireframeLayout>
  );
};

export default SuperAdminGeography;
