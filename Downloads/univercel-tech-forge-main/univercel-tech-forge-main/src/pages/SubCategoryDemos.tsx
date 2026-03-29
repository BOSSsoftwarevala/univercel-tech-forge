import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ExternalLink, Play, Monitor, Smartphone, Tablet, Star, Eye, TrendingUp, Sparkles, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center glass-panel p-8 rounded-2xl"
        >
          <p className="text-muted-foreground mb-4">Category not found</p>
          <Button onClick={() => navigate("/sectors")} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Sectors
          </Button>
        </motion.div>
      </div>
    );
  }

  const SectorIcon = sector.icon;
  const SubCategoryIcon = subCategory.icon;

  // Generate 9 premium demos
  const demos = Array.from({ length: 9 }, (_, i) => ({
    id: `${subCategory.id}-demo-${i + 1}`,
    name: `${subCategory.name} Pro ${i + 1}`,
    number: i + 1,
    status: i < 4 ? "live" : i < 7 ? "pending" : "maintenance",
    platform: i % 3 === 0 ? "web" : i % 3 === 1 ? "mobile" : "tablet",
    views: Math.floor(Math.random() * 2000) + 500,
    rating: (4.5 + Math.random() * 0.5).toFixed(1),
    isVerified: i < 5,
    isTrending: i < 3,
    features: ["Real-time Sync", "Analytics", "Multi-tenant"],
    price: `₹${(25 + i * 5)}K`
  }));

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "live":
        return { 
          bg: "bg-emerald-500/20", 
          text: "text-emerald-400", 
          border: "border-emerald-500/30",
          glow: "shadow-emerald-500/20"
        };
      case "pending":
        return { 
          bg: "bg-amber-500/20", 
          text: "text-amber-400", 
          border: "border-amber-500/30",
          glow: "shadow-amber-500/20"
        };
      default:
        return { 
          bg: "bg-slate-500/20", 
          text: "text-slate-400", 
          border: "border-slate-500/30",
          glow: "shadow-slate-500/20"
        };
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "mobile": return Smartphone;
      case "tablet": return Tablet;
      default: return Monitor;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neon-teal/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10">
        {/* Premium Header */}
        <header className="sticky top-0 z-50 glass-panel border-b border-border/30 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate("/sectors")}
                  className="shrink-0 hover:bg-primary/10"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                
                <div className="flex items-center gap-3">
                  <motion.div 
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-neon-teal/20 flex items-center justify-center shadow-lg"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                  >
                    <SectorIcon className="w-6 h-6 text-primary" />
                  </motion.div>
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{sector.name}</span>
                      <span className="text-primary">→</span>
                      <span className="text-foreground font-semibold">{subCategory.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      9 Premium Demo Applications
                    </p>
                  </div>
                </div>
              </div>

              <Badge className="bg-gradient-to-r from-primary/20 to-neon-teal/20 text-primary border-primary/30">
                <Shield className="w-3 h-3 mr-1" />
                Verified Collection
              </Badge>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel border-border/30 rounded-2xl p-8 mb-8 relative overflow-hidden"
          >
            {/* Background Gradient */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-neon-teal/10 to-primary/10 rounded-full blur-3xl" />
            
            <div className="flex items-center gap-6 relative">
              <motion.div 
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-neon-teal/30 to-primary/30 flex items-center justify-center shadow-xl shadow-primary/10"
                whileHover={{ scale: 1.05 }}
                animate={{ 
                  boxShadow: ['0 0 20px rgba(6,182,212,0.2)', '0 0 40px rgba(6,182,212,0.3)', '0 0 20px rgba(6,182,212,0.2)']
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <SubCategoryIcon className="w-10 h-10 text-neon-teal" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">{subCategory.name}</h1>
                <p className="text-muted-foreground max-w-xl">
                  Explore our premium collection of {subCategory.name} demo applications. 
                  Each demo is fully functional and ready for customization.
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Eye className="w-4 h-4 text-primary" />
                    <span>12.5K views</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span>4.8 avg rating</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span>Trending</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Premium Demo Grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.08 }
              }
            }}
          >
            {demos.map((demo, index) => {
              const PlatformIcon = getPlatformIcon(demo.platform);
              const statusConfig = getStatusConfig(demo.status);
              
              return (
                <motion.div
                  key={demo.id}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  whileHover={{ y: -4 }}
                  className="group"
                >
                  <Card className={`glass-panel border-border/30 hover:border-primary/50 transition-all duration-500 overflow-hidden hover:shadow-2xl hover:shadow-primary/10 ${demo.isTrending ? 'ring-2 ring-amber-500/20' : ''}`}>
                    {/* Demo Preview */}
                    <div className="h-44 bg-gradient-to-br from-secondary via-secondary/80 to-muted relative overflow-hidden">
                      {/* Animated Background Pattern */}
                      <div className="absolute inset-0 opacity-20">
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)] bg-[length:20px_20px]" />
                      </div>
                      
                      {/* Icon Container */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div 
                          className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/40 to-neon-teal/40 flex items-center justify-center backdrop-blur-sm shadow-xl"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <SubCategoryIcon className="w-12 h-12 text-primary/80" />
                        </motion.div>
                      </div>
                      
                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <Badge variant="outline" className="bg-background/90 backdrop-blur-sm font-semibold">
                          Demo {demo.number}
                        </Badge>
                        {demo.isVerified && (
                          <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                            <Shield className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>

                      {/* Status & Trending */}
                      <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
                        <Badge variant="outline" className={`${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                          {demo.status === 'live' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1" />}
                          {demo.status}
                        </Badge>
                        {demo.isTrending && (
                          <Badge className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Trending
                          </Badge>
                        )}
                      </div>

                      {/* Hover Play Overlay */}
                      <motion.div 
                        className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"
                        initial={false}
                      >
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-neon-teal flex items-center justify-center shadow-xl shadow-primary/50"
                        >
                          <Play className="w-6 h-6 text-white ml-1" />
                        </motion.div>
                      </motion.div>
                    </div>

                    <CardContent className="p-5">
                      {/* Title & Info */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-foreground group-hover:text-primary transition-colors truncate">
                            {demo.name}
                          </h3>
                          <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <PlatformIcon className="w-3.5 h-3.5" />
                              <span className="capitalize">{demo.platform}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5" />
                              <span>{demo.views.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                              <span>{demo.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {demo.features.map((feature) => (
                          <span 
                            key={feature}
                            className="text-xs px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>

                      {/* Price & CTA */}
                      <div className="flex items-center justify-between pt-3 border-t border-border/50">
                        <div>
                          <span className="text-xl font-bold bg-gradient-to-r from-primary to-neon-teal bg-clip-text text-transparent">
                            {demo.price}
                          </span>
                          <span className="text-xs text-muted-foreground ml-1">onwards</span>
                        </div>
                        <Button size="sm" className="gap-1.5 bg-gradient-to-r from-primary/20 to-neon-teal/20 hover:from-primary hover:to-neon-teal text-primary hover:text-white border border-primary/30 hover:border-transparent transition-all">
                          <Play className="w-3.5 h-3.5" />
                          View Demo
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
