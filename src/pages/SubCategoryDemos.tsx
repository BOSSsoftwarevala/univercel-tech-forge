import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Play, Monitor, Smartphone, Tablet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSectorById, getSubCategoryById } from "@/data/sectorsData";

const SubCategoryDemos = () => {
  const { sectorId, subCategoryId } = useParams();
  const navigate = useNavigate();

  const sector = sectorId ? getSectorById(sectorId) : undefined;
  const subCategory = sectorId && subCategoryId ? getSubCategoryById(sectorId, subCategoryId) : undefined;

  if (!sector || !subCategory) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Category not found</p>
          <Button onClick={() => navigate("/sectors")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sectors
          </Button>
        </div>
      </div>
    );
  }

  const SectorIcon = sector.icon;
  const SubCategoryIcon = subCategory.icon;

  // Generate 9 demos for this sub-category
  const demos = Array.from({ length: 9 }, (_, i) => ({
    id: `${subCategory.id}-demo-${i + 1}`,
    name: `${subCategory.name} Demo ${i + 1}`,
    number: i + 1,
    status: i < 3 ? "live" : i < 6 ? "pending" : "maintenance",
    platform: i % 3 === 0 ? "web" : i % 3 === 1 ? "mobile" : "tablet",
    views: Math.floor(Math.random() * 1000) + 100
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-neon-green/20 text-neon-green border-neon-green/30";
      case "pending":
        return "bg-neon-orange/20 text-neon-orange border-neon-orange/30";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "mobile":
        return Smartphone;
      case "tablet":
        return Tablet;
      default:
        return Monitor;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neon-teal/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-50 glass-panel border-b border-border/30">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/sectors")}
                className="shrink-0"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-neon-teal/20 flex items-center justify-center">
                  <SectorIcon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{sector.name}</span>
                    <span>→</span>
                    <span className="text-foreground font-medium">{subCategory.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">9 Demo Applications</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Demo Cards Grid */}
        <main className="container mx-auto px-4 py-6">
          {/* Sub-Category Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel border-border/30 rounded-xl p-6 mb-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-neon-teal/20 to-primary/20 flex items-center justify-center">
                <SubCategoryIcon className="w-8 h-8 text-neon-teal" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{subCategory.name}</h1>
                <p className="text-muted-foreground">Browse all {subCategory.name} demo applications</p>
              </div>
            </div>
          </motion.div>

          {/* Demos Grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.05 }
              }
            }}
          >
            {demos.map((demo, index) => {
              const PlatformIcon = getPlatformIcon(demo.platform);
              return (
                <motion.div
                  key={demo.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  <Card className="group glass-panel border-border/30 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 overflow-hidden">
                    {/* Demo Preview Area */}
                    <div className="h-36 bg-gradient-to-br from-secondary via-secondary/80 to-muted relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary/30 to-neon-teal/30 flex items-center justify-center backdrop-blur-sm">
                          <SubCategoryIcon className="w-10 h-10 text-primary/70" />
                        </div>
                      </div>
                      
                      {/* Demo Number Badge */}
                      <div className="absolute top-3 left-3">
                        <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
                          Demo {demo.number}
                        </Badge>
                      </div>

                      {/* Status Badge */}
                      <div className="absolute top-3 right-3">
                        <Badge variant="outline" className={getStatusColor(demo.status)}>
                          {demo.status}
                        </Badge>
                      </div>

                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background/50 backdrop-blur-sm">
                        <Button size="lg" className="gap-2">
                          <Play className="w-5 h-5" />
                          View Demo
                        </Button>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground truncate">{demo.name}</h3>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <PlatformIcon className="w-3 h-3" />
                            <span className="capitalize">{demo.platform}</span>
                            <span>•</span>
                            <span>{demo.views} views</span>
                          </div>
                        </div>
                        <Button size="icon" variant="ghost" className="shrink-0">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default SubCategoryDemos;
