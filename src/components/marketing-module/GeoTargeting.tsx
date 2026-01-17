import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Globe2, MapPin, Languages, DollarSign,
  CheckCircle2, Settings, Zap, Target
} from "lucide-react";
import { toast } from "sonner";

const regions = [
  {
    continent: "Africa",
    countries: [
      { code: "NG", name: "Nigeria", language: "English", currency: "NGN", active: true },
      { code: "KE", name: "Kenya", language: "Swahili", currency: "KES", active: true },
      { code: "ZA", name: "South Africa", language: "English", currency: "ZAR", active: true },
      { code: "GH", name: "Ghana", language: "English", currency: "GHS", active: false },
    ]
  },
  {
    continent: "Asia",
    countries: [
      { code: "IN", name: "India", language: "Hindi", currency: "INR", active: true },
      { code: "PK", name: "Pakistan", language: "Urdu", currency: "PKR", active: true },
      { code: "BD", name: "Bangladesh", language: "Bengali", currency: "BDT", active: false },
      { code: "ID", name: "Indonesia", language: "Indonesian", currency: "IDR", active: false },
    ]
  },
  {
    continent: "Middle East",
    countries: [
      { code: "AE", name: "UAE", language: "Arabic", currency: "AED", active: true },
      { code: "SA", name: "Saudi Arabia", language: "Arabic", currency: "SAR", active: true },
      { code: "QA", name: "Qatar", language: "Arabic", currency: "QAR", active: false },
      { code: "KW", name: "Kuwait", language: "Arabic", currency: "KWD", active: false },
    ]
  },
];

const languageSettings = [
  { code: "en", name: "English", autoTranslate: true, regions: 12 },
  { code: "hi", name: "Hindi", autoTranslate: true, regions: 3 },
  { code: "ar", name: "Arabic", autoTranslate: true, regions: 8 },
  { code: "sw", name: "Swahili", autoTranslate: true, regions: 4 },
  { code: "fr", name: "French", autoTranslate: false, regions: 6 },
];

export const GeoTargeting = () => {
  const [expandedContinent, setExpandedContinent] = useState<string | null>("Africa");

  const handleToggleCountry = (countryCode: string, active: boolean) => {
    toast.success(`${countryCode} ${active ? "enabled" : "disabled"} for targeting`);
  };

  const handleLanguageToggle = (langCode: string, enabled: boolean) => {
    toast.success(`Auto-translate ${enabled ? "enabled" : "disabled"} for ${langCode}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Geo Targeting</h1>
          <p className="text-muted-foreground">Configure regional marketing & language settings</p>
        </div>
        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
          <Globe2 className="w-3 h-3 mr-1" />
          Global Reach
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Region Configuration */}
        <div className="lg:col-span-2 space-y-4">
          {regions.map((region) => (
            <Card key={region.continent} className="bg-card/50 backdrop-blur border-border/50">
              <CardHeader 
                className="pb-3 cursor-pointer"
                onClick={() => setExpandedContinent(
                  expandedContinent === region.continent ? null : region.continent
                )}
              >
                <CardTitle className="text-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe2 className="w-5 h-5 text-emerald-400" />
                    {region.continent}
                  </div>
                  <Badge variant="outline">
                    {region.countries.filter(c => c.active).length}/{region.countries.length} active
                  </Badge>
                </CardTitle>
              </CardHeader>
              
              {expandedContinent === region.continent && (
                <CardContent>
                  <div className="space-y-3">
                    {region.countries.map((country) => (
                      <motion.div
                        key={country.code}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="flex items-center justify-between p-3 rounded-lg bg-accent/30"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                            <span className="text-sm font-bold text-emerald-400">{country.code}</span>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{country.name}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Languages className="w-3 h-3" />
                              {country.language}
                              <span className="mx-1">•</span>
                              <DollarSign className="w-3 h-3" />
                              {country.currency}
                            </div>
                          </div>
                        </div>
                        <Switch
                          checked={country.active}
                          onCheckedChange={(checked) => handleToggleCountry(country.code, checked)}
                        />
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Language Settings */}
        <div className="space-y-4">
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Languages className="w-5 h-5 text-emerald-400" />
                Language Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {languageSettings.map((lang) => (
                  <div 
                    key={lang.code}
                    className="flex items-center justify-between p-3 rounded-lg bg-accent/30"
                  >
                    <div>
                      <p className="font-medium text-foreground">{lang.name}</p>
                      <p className="text-xs text-muted-foreground">{lang.regions} regions</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge 
                        className={lang.autoTranslate 
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          : "bg-muted text-muted-foreground"
                        }
                      >
                        <Zap className="w-3 h-3 mr-1" />
                        Auto
                      </Badge>
                      <Switch
                        checked={lang.autoTranslate}
                        onCheckedChange={(checked) => handleLanguageToggle(lang.code, checked)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-400" />
                Targeting Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Active Countries</span>
                  <span className="font-semibold text-foreground">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Languages</span>
                  <span className="font-semibold text-foreground">5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Currencies</span>
                  <span className="font-semibold text-foreground">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Coverage</span>
                  <span className="font-semibold text-emerald-400">67%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
