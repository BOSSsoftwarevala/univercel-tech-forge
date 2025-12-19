import { motion } from "framer-motion";
import { Play, Lock, Star, Sparkles, Eye, Clock, Download, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const VIPDemoAccess = () => {
  const demos = [
    { id: "DEMO-001", name: "AI Analytics Suite v3.0", type: "beta", status: "available", access: "exclusive", releaseDate: "Jan 2025" },
    { id: "DEMO-002", name: "Smart Inventory System", type: "preview", status: "available", access: "vip", releaseDate: "Feb 2025" },
    { id: "DEMO-003", name: "Real-Time Collaboration Hub", type: "beta", status: "locked", access: "nda", releaseDate: "Mar 2025" },
    { id: "DEMO-004", name: "Advanced Reporting Engine", type: "early-access", status: "available", access: "vip", releaseDate: "Dec 2024" },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "beta": return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "preview": return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "early-access": return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      default: return "bg-stone-700 text-stone-300";
    }
  };

  const getAccessBadge = (access: string) => {
    switch (access) {
      case "exclusive": return { icon: Star, color: "text-amber-400", label: "Exclusive" };
      case "vip": return { icon: Sparkles, color: "text-purple-400", label: "VIP Only" };
      case "nda": return { icon: Lock, color: "text-red-400", label: "NDA Required" };
      default: return { icon: Eye, color: "text-stone-400", label: "Standard" };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-amber-100">VIP Demo Access</h2>
          <p className="text-stone-400">Priority access to unreleased demos and beta features</p>
        </div>
        <Badge className="bg-gradient-to-r from-amber-500/20 to-purple-500/20 text-amber-300 border border-amber-500/30 px-4 py-2">
          <Star className="w-4 h-4 mr-2 fill-amber-400 text-amber-400" />
          VIP Access Enabled
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-stone-900/50 border-amber-500/20">
          <CardContent className="p-4 text-center">
            <Play className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-amber-100">4</div>
            <div className="text-xs text-stone-400">Available Demos</div>
          </CardContent>
        </Card>
        <Card className="bg-stone-900/50 border-purple-500/20">
          <CardContent className="p-4 text-center">
            <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-100">2</div>
            <div className="text-xs text-stone-400">Beta Programs</div>
          </CardContent>
        </Card>
        <Card className="bg-stone-900/50 border-emerald-500/20">
          <CardContent className="p-4 text-center">
            <Eye className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-emerald-100">15</div>
            <div className="text-xs text-stone-400">Demos Viewed</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {demos.map((demo, index) => {
          const accessInfo = getAccessBadge(demo.access);
          const AccessIcon = accessInfo.icon;
          
          return (
            <motion.div
              key={demo.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`bg-stone-900/50 border-amber-500/20 hover:border-amber-500/40 transition-all ${demo.status === "locked" ? "opacity-75" : ""}`}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getTypeColor(demo.type)}>
                          {demo.type.toUpperCase()}
                        </Badge>
                        <div className={`flex items-center gap-1 ${accessInfo.color}`}>
                          <AccessIcon className="w-4 h-4" />
                          <span className="text-xs">{accessInfo.label}</span>
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-amber-100">{demo.name}</h3>
                      <p className="text-sm text-stone-400 mt-1">
                        <Clock className="w-3 h-3 inline mr-1" />
                        Release: {demo.releaseDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {demo.status === "locked" ? (
                      <Button disabled className="flex-1 bg-stone-800 border border-stone-600 text-stone-500">
                        <Lock className="w-4 h-4 mr-2" />
                        NDA Required
                      </Button>
                    ) : (
                      <>
                        <Button className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 text-stone-900 hover:from-amber-400 hover:to-amber-500">
                          <Play className="w-4 h-4 mr-2" />
                          Launch Demo
                        </Button>
                        <Button variant="outline" className="border-amber-500/30 text-amber-300 hover:bg-amber-500/10">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Card className="bg-gradient-to-r from-purple-900/30 to-amber-900/30 border-purple-500/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-purple-100 mb-2">Beta Testing Program</h3>
              <p className="text-stone-300">Get early access to features before anyone else. Your feedback shapes the product.</p>
            </div>
            <Button className="bg-purple-500 hover:bg-purple-600 text-white">
              <Sparkles className="w-4 h-4 mr-2" />
              Join Beta Program
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VIPDemoAccess;
