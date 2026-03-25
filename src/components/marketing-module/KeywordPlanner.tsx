import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileSearch, 
  Search, 
  TrendingUp, 
  DollarSign,
  Target,
  Save,
  Wand2,
  Globe,
  BarChart3,
  ArrowUpRight
} from "lucide-react";

const keywordData = [
  { 
    keyword: "franchise business Africa", 
    volume: 12400, 
    difficulty: "Medium", 
    cpc: "$2.40", 
    intent: "Commercial",
    trend: "rising"
  },
  { 
    keyword: "software reseller program", 
    volume: 8900, 
    difficulty: "Low", 
    cpc: "$3.20", 
    intent: "Transactional",
    trend: "stable"
  },
  { 
    keyword: "best POS system Nigeria", 
    volume: 6700, 
    difficulty: "Low", 
    cpc: "$1.80", 
    intent: "Commercial",
    trend: "rising"
  },
  { 
    keyword: "business management software Kenya", 
    volume: 5400, 
    difficulty: "Medium", 
    cpc: "$2.10", 
    intent: "Commercial",
    trend: "rising"
  },
  { 
    keyword: "franchise opportunities UAE", 
    volume: 4800, 
    difficulty: "High", 
    cpc: "$4.50", 
    intent: "Transactional",
    trend: "stable"
  },
  { 
    keyword: "inventory software Middle East", 
    volume: 3200, 
    difficulty: "Low", 
    cpc: "$1.90", 
    intent: "Informational",
    trend: "rising"
  },
];

const continents = ["All Continents", "Africa", "Asia", "Middle East", "Europe", "Americas"];
const countries = ["All Countries", "Nigeria", "Kenya", "South Africa", "UAE", "Saudi Arabia", "India", "Pakistan"];

export const KeywordPlanner = () => {
  const [selectedContinent, setSelectedContinent] = useState("All Continents");
  const [selectedCountry, setSelectedCountry] = useState("All Countries");
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Keyword Planner</h1>
          <p className="text-muted-foreground">AI-powered keyword research by country</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Wand2 className="w-4 h-4" />
            AI Suggest
          </Button>
          <Button className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-500">
            <Save className="w-4 h-4" />
            Save Keywords
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search keywords..." 
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Select value={selectedContinent} onValueChange={setSelectedContinent}>
              <SelectTrigger className="w-[180px]">
                <Globe className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {continents.map((continent) => (
                  <SelectItem key={continent} value={continent}>{continent}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>{country}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Search className="w-4 h-4" />
              Research
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Keywords Found", value: "247", icon: FileSearch, color: "from-blue-500 to-cyan-500" },
          { label: "Avg. Search Volume", value: "6,900", icon: TrendingUp, color: "from-emerald-500 to-teal-500" },
          { label: "Avg. CPC", value: "$2.65", icon: DollarSign, color: "from-amber-500 to-orange-500" },
          { label: "High Intent", value: "89", icon: Target, color: "from-violet-500 to-purple-500" },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-card/50 border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-foreground">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Keywords Table */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSearch className="w-5 h-5 text-emerald-400" />
            Keyword Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {keywordData.map((item, index) => (
              <motion.div
                key={item.keyword}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border/50 hover:border-emerald-500/30 transition-all"
              >
                <div className="flex items-center gap-4 flex-1">
                  <input type="checkbox" className="rounded border-border" />
                  <div>
                    <div className="font-medium text-foreground">{item.keyword}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{item.intent}</Badge>
                      {item.trend === "rising" && (
                        <span className="flex items-center gap-1 text-xs text-emerald-400">
                          <ArrowUpRight className="w-3 h-3" /> Rising
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">{item.volume.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Volume</div>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant="outline" 
                      className={
                        item.difficulty === "Low" ? "text-emerald-400 border-emerald-400/30" :
                        item.difficulty === "Medium" ? "text-amber-400 border-amber-400/30" :
                        "text-red-400 border-red-400/30"
                      }
                    >
                      {item.difficulty}
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-1">Difficulty</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">{item.cpc}</div>
                    <div className="text-xs text-muted-foreground">Est. CPC</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">SEO</Button>
                    <Button size="sm" variant="outline">Ads</Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
