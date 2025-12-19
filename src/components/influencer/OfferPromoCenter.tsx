import { motion } from "framer-motion";
import { Gift, Clock, Tag, Sparkles, Flame, Percent, Calendar, ChevronRight, Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const OfferPromoCenter = () => {
  const activeOffers = [
    { 
      id: 1, 
      name: "New Year Mega Sale", 
      discount: "30%", 
      type: "seasonal",
      expires: "Dec 31, 2024",
      commission: "12%",
      code: "NEWYEAR30",
      hot: true
    },
    { 
      id: 2, 
      name: "Flash Friday Deal", 
      discount: "25%", 
      type: "flash",
      expires: "Dec 20, 2024",
      commission: "10%",
      code: "FLASH25",
      hot: true
    },
    { 
      id: 3, 
      name: "Bundle Special", 
      discount: "40%", 
      type: "bundle",
      expires: "Jan 15, 2025",
      commission: "15%",
      code: "BUNDLE40",
      hot: false
    },
  ];

  const specialLinks = [
    { name: "Holiday Landing Page", clicks: 2340, conversions: 156 },
    { name: "Premium Demo Access", clicks: 1890, conversions: 98 },
    { name: "Limited Time Offer", clicks: 3120, conversions: 234 },
  ];

  const boosts = [
    { name: "2X Commission Weekend", status: "active", remaining: "2 days" },
    { name: "Bonus Click Rewards", status: "upcoming", starts: "Dec 25" },
    { name: "Top Performer Boost", status: "locked", requirement: "Reach Gold tier" },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "seasonal": return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case "flash": return "bg-red-500/20 text-red-300 border-red-500/30";
      case "bundle": return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      default: return "bg-slate-500/20 text-slate-300";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-violet-100">Offer & Promo Center</h2>
          <p className="text-slate-400">Seasonal campaigns, special links, and limited-time boosts</p>
        </div>
        <Badge className="bg-gradient-to-r from-red-500/20 to-amber-500/20 text-amber-300 border border-amber-500/30 px-4 py-2">
          <Flame className="w-4 h-4 mr-2" />
          3 Active Offers
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-violet-500/20">
          <CardContent className="p-4 text-center">
            <Gift className="w-8 h-8 text-violet-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-violet-100">3</div>
            <div className="text-xs text-slate-400">Active Offers</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-emerald-500/20">
          <CardContent className="p-4 text-center">
            <Percent className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-emerald-100">40%</div>
            <div className="text-xs text-slate-400">Max Discount</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-amber-500/20">
          <CardContent className="p-4 text-center">
            <Tag className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-amber-100">15%</div>
            <div className="text-xs text-slate-400">Max Commission</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-red-500/20">
          <CardContent className="p-4 text-center">
            <Sparkles className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-100">2</div>
            <div className="text-xs text-slate-400">Active Boosts</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold text-violet-100">Active Campaigns</h3>
          {activeOffers.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-slate-900/50 border-violet-500/20 overflow-hidden">
                {offer.hot && (
                  <div className="bg-gradient-to-r from-red-500 to-amber-500 text-white text-xs font-bold px-3 py-1 flex items-center gap-1">
                    <Flame className="w-3 h-3" /> HOT OFFER
                  </div>
                )}
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-violet-100">{offer.name}</h4>
                        <Badge className={getTypeColor(offer.type)}>{offer.type}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span><Clock className="w-3 h-3 inline mr-1" />Expires: {offer.expires}</span>
                        <span><Tag className="w-3 h-3 inline mr-1" />Commission: {offer.commission}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-emerald-400">{offer.discount}</div>
                      <div className="text-xs text-slate-500">OFF</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <div>
                      <span className="text-xs text-slate-500">Promo Code</span>
                      <div className="font-mono text-violet-300 font-bold">{offer.code}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" className="text-violet-400">
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button size="sm" className="bg-gradient-to-r from-violet-500 to-cyan-500 text-white">
                        Get Link
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="space-y-6">
          <Card className="bg-slate-900/50 border-violet-500/20">
            <CardHeader>
              <CardTitle className="text-violet-100 text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-400" />
                Special Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {specialLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-violet-100 text-sm">{link.name}</span>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-violet-400 transition-colors" />
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                    <span>{link.clicks.toLocaleString()} clicks</span>
                    <span>{link.conversions} conversions</span>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-violet-500/20">
            <CardHeader>
              <CardTitle className="text-violet-100 text-lg flex items-center gap-2">
                <Flame className="w-5 h-5 text-violet-400" />
                Limited Time Boosts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {boosts.map((boost, index) => (
                <motion.div
                  key={boost.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-3 rounded-lg ${
                    boost.status === "active" 
                      ? "bg-emerald-500/10 border border-emerald-500/20" 
                      : boost.status === "upcoming"
                      ? "bg-amber-500/10 border border-amber-500/20"
                      : "bg-slate-800/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-violet-100 font-medium">{boost.name}</span>
                    <Badge className={
                      boost.status === "active" ? "bg-emerald-500/20 text-emerald-300" :
                      boost.status === "upcoming" ? "bg-amber-500/20 text-amber-300" :
                      "bg-slate-700 text-slate-400"
                    }>
                      {boost.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {boost.remaining || boost.starts || boost.requirement}
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OfferPromoCenter;
