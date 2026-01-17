import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Globe2, 
  Target, 
  DollarSign, 
  Wand2,
  Play,
  FileText,
  Users,
  Building2,
  Briefcase,
  Megaphone
} from "lucide-react";

const continents = [
  { id: "africa", name: "Africa", countries: 54, activeCampaigns: 12 },
  { id: "asia", name: "Asia", countries: 48, activeCampaigns: 8 },
  { id: "middle-east", name: "Middle East", countries: 17, activeCampaigns: 6 },
  { id: "europe", name: "Europe", countries: 44, activeCampaigns: 4 },
  { id: "americas", name: "Americas", countries: 35, activeCampaigns: 3 },
];

const countryStrategies = [
  { 
    country: "Nigeria", 
    target: "Franchise", 
    platform: "Meta Ads", 
    budget: "$500/day", 
    content: "Video",
    status: "active"
  },
  { 
    country: "Kenya", 
    target: "Reseller", 
    platform: "Google Ads", 
    budget: "$300/day", 
    content: "Search",
    status: "active"
  },
  { 
    country: "UAE", 
    target: "Product", 
    platform: "LinkedIn", 
    budget: "$400/day", 
    content: "Carousel",
    status: "pending"
  },
  { 
    country: "South Africa", 
    target: "Franchise", 
    platform: "Meta Ads", 
    budget: "$350/day", 
    content: "Video",
    status: "active"
  },
  { 
    country: "India", 
    target: "Reseller", 
    platform: "Google Ads", 
    budget: "$250/day", 
    content: "Search",
    status: "optimizing"
  },
];

const targetIcons: Record<string, typeof Target> = {
  "Product": Target,
  "Franchise": Building2,
  "Reseller": Users,
  "Job": Briefcase,
};

export const CountryStrategy = () => {
  const [selectedContinent, setSelectedContinent] = useState("africa");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedTarget, setSelectedTarget] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Country Strategy</h1>
          <p className="text-muted-foreground">AI-powered targeting by region</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Wand2 className="w-4 h-4" />
            AI Suggest Strategy
          </Button>
          <Button className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-500">
            <Play className="w-4 h-4" />
            Launch Campaign
          </Button>
        </div>
      </div>

      {/* Continent Selection */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {continents.map((continent, index) => (
          <motion.div
            key={continent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedContinent === continent.id 
                  ? "border-emerald-500 bg-emerald-500/10" 
                  : "bg-card/50 border-border/50"
              }`}
              onClick={() => setSelectedContinent(continent.id)}
            >
              <CardContent className="p-4 text-center">
                <Globe2 className={`w-8 h-8 mx-auto mb-2 ${
                  selectedContinent === continent.id ? "text-emerald-400" : "text-muted-foreground"
                }`} />
                <div className="font-medium text-foreground">{continent.name}</div>
                <div className="text-xs text-muted-foreground">{continent.countries} countries</div>
                <Badge variant="outline" className="mt-2 text-emerald-400 border-emerald-400/30">
                  {continent.activeCampaigns} active
                </Badge>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Strategy Builder */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle>Build Country Strategy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger>
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nigeria">Nigeria</SelectItem>
                <SelectItem value="kenya">Kenya</SelectItem>
                <SelectItem value="south-africa">South Africa</SelectItem>
                <SelectItem value="ghana">Ghana</SelectItem>
                <SelectItem value="egypt">Egypt</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedTarget} onValueChange={setSelectedTarget}>
              <SelectTrigger>
                <SelectValue placeholder="Select Target" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="product">Product Sales</SelectItem>
                <SelectItem value="franchise">Franchise Recruitment</SelectItem>
                <SelectItem value="reseller">Reseller Program</SelectItem>
                <SelectItem value="job">Job Applications</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Wand2 className="w-4 h-4" />
              Get AI Suggestions
            </Button>
            <Button className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-500">
              Apply Strategy
            </Button>
          </div>

          {/* AI Suggestions Preview */}
          <div className="mt-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
            <div className="flex items-center gap-2 mb-4">
              <Wand2 className="w-5 h-5 text-emerald-400" />
              <span className="font-medium text-emerald-400">AI Recommended Strategy</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 rounded-lg bg-background/50">
                <div className="flex items-center gap-2 mb-2">
                  <Megaphone className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-foreground">Best Platform</span>
                </div>
                <div className="text-lg font-bold text-foreground">Meta Ads</div>
                <div className="text-xs text-muted-foreground">High engagement in this region</div>
              </div>
              <div className="p-3 rounded-lg bg-background/50">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-medium text-foreground">Daily Budget</span>
                </div>
                <div className="text-lg font-bold text-foreground">$350 - $500</div>
                <div className="text-xs text-muted-foreground">Optimal for target audience</div>
              </div>
              <div className="p-3 rounded-lg bg-background/50">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-violet-400" />
                  <span className="text-sm font-medium text-foreground">Content Type</span>
                </div>
                <div className="text-lg font-bold text-foreground">Video Ads</div>
                <div className="text-xs text-muted-foreground">3.2x higher conversion</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Strategies */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-emerald-400" />
            Active Country Strategies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {countryStrategies.map((strategy, index) => {
              const TargetIcon = targetIcons[strategy.target] || Target;
              return (
                <motion.div
                  key={strategy.country}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
                      <Globe2 className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{strategy.country}</div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <TargetIcon className="w-3 h-3" />
                        {strategy.target}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-sm font-medium text-foreground">{strategy.platform}</div>
                      <div className="text-xs text-muted-foreground">Platform</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-foreground">{strategy.budget}</div>
                      <div className="text-xs text-muted-foreground">Budget</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-foreground">{strategy.content}</div>
                      <div className="text-xs text-muted-foreground">Content</div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={
                        strategy.status === "active" ? "text-emerald-400 border-emerald-400/30" :
                        strategy.status === "optimizing" ? "text-amber-400 border-amber-400/30" :
                        "text-blue-400 border-blue-400/30"
                      }
                    >
                      {strategy.status}
                    </Badge>
                    <Button size="sm" variant="ghost">Edit</Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
