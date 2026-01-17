import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileSearch, Globe2, TrendingUp, DollarSign,
  Search, Save, Target, Zap, ArrowUpRight
} from "lucide-react";
import { toast } from "sonner";

const continents = [
  { id: "africa", label: "Africa" },
  { id: "asia", label: "Asia" },
  { id: "middle-east", label: "Middle East" },
  { id: "europe", label: "Europe" },
  { id: "americas", label: "Americas" },
];

const countries: Record<string, { id: string; label: string }[]> = {
  africa: [
    { id: "ng", label: "Nigeria" },
    { id: "ke", label: "Kenya" },
    { id: "za", label: "South Africa" },
    { id: "gh", label: "Ghana" },
  ],
  asia: [
    { id: "in", label: "India" },
    { id: "pk", label: "Pakistan" },
    { id: "bd", label: "Bangladesh" },
    { id: "id", label: "Indonesia" },
  ],
  "middle-east": [
    { id: "ae", label: "UAE" },
    { id: "sa", label: "Saudi Arabia" },
    { id: "qa", label: "Qatar" },
    { id: "kw", label: "Kuwait" },
  ],
};

const keywordResults = [
  { 
    keyword: "school management software",
    volume: 14500,
    competition: "medium",
    cpc: 2.45,
    trend: "+12%",
    opportunity: 85
  },
  { 
    keyword: "erp software for business",
    volume: 9800,
    competition: "high",
    cpc: 4.20,
    trend: "+8%",
    opportunity: 72
  },
  { 
    keyword: "franchise management system",
    volume: 5600,
    competition: "low",
    cpc: 1.85,
    trend: "+22%",
    opportunity: 94
  },
  { 
    keyword: "pos software",
    volume: 18200,
    competition: "high",
    cpc: 3.50,
    trend: "+5%",
    opportunity: 65
  },
  { 
    keyword: "inventory management software",
    volume: 12300,
    competition: "medium",
    cpc: 2.90,
    trend: "+15%",
    opportunity: 78
  },
];

export const KeywordResearch = () => {
  const [selectedContinent, setSelectedContinent] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (!searchQuery) {
      toast.error("Enter a keyword to research");
      return;
    }
    setIsSearching(true);
    toast.info("Researching keywords...");
    setTimeout(() => {
      setIsSearching(false);
      toast.success("Keyword research complete!");
    }, 2000);
  };

  const handleSaveKeyword = (keyword: string) => {
    toast.success(`Saved: ${keyword}`);
  };

  const handleAssignKeyword = (keyword: string, target: string) => {
    toast.success(`Assigned to ${target}: ${keyword}`);
  };

  const getCompetitionColor = (competition: string) => {
    switch (competition) {
      case "low": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "medium": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "high": return "bg-rose-500/20 text-rose-400 border-rose-500/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getOpportunityColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-amber-400";
    return "text-rose-400";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Keyword Research</h1>
          <p className="text-muted-foreground">Discover high-value keywords by region</p>
        </div>
        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
          <Zap className="w-3 h-3 mr-1" />
          AI-Powered
        </Badge>
      </div>

      {/* Search Panel */}
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardContent className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Continent</label>
              <Select value={selectedContinent} onValueChange={(val) => {
                setSelectedContinent(val);
                setSelectedCountry("");
              }}>
                <SelectTrigger>
                  <Globe2 className="w-4 h-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Select continent" />
                </SelectTrigger>
                <SelectContent>
                  {continents.map((continent) => (
                    <SelectItem key={continent.id} value={continent.id}>
                      {continent.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Country</label>
              <Select 
                value={selectedCountry} 
                onValueChange={setSelectedCountry}
                disabled={!selectedContinent}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {(countries[selectedContinent] || []).map((country) => (
                    <SelectItem key={country.id} value={country.id}>
                      {country.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-muted-foreground mb-2 block">Seed Keyword</label>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter keyword (e.g., school software)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background/50"
                  />
                </div>
                <Button 
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <FileSearch className="w-4 h-4 mr-2" />
                  Research
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Keyword Results */}
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Keyword Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {keywordResults.map((kw, index) => (
              <motion.div
                key={kw.keyword}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-foreground">{kw.keyword}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <Badge className={getCompetitionColor(kw.competition)}>
                      {kw.competition}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                      {kw.trend}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="font-semibold text-foreground">{kw.volume.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Volume</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-foreground">${kw.cpc}</p>
                    <p className="text-xs text-muted-foreground">CPC</p>
                  </div>
                  <div className="text-center">
                    <p className={`font-semibold ${getOpportunityColor(kw.opportunity)}`}>
                      {kw.opportunity}
                    </p>
                    <p className="text-xs text-muted-foreground">Score</p>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleSaveKeyword(kw.keyword)}
                      title="Save keyword"
                    >
                      <Save className="w-4 h-4 text-emerald-400" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleAssignKeyword(kw.keyword, "SEO")}
                      title="Assign to SEO"
                    >
                      <Search className="w-4 h-4 text-blue-400" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleAssignKeyword(kw.keyword, "Ads")}
                      title="Assign to Ads"
                    >
                      <Target className="w-4 h-4 text-purple-400" />
                    </Button>
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
