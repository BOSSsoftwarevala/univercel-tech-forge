import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Key, 
  Globe, 
  RefreshCw, 
  Lock,
  Calendar,
  Shield
} from "lucide-react";

const licenses = [
  { 
    product: "RetailMaster Pro", 
    domain: "retail.client1.com",
    licenseKey: "RM-XXXX-XXXX-1234",
    status: "active",
    expiry: "2025-12-31",
    type: "Lifetime"
  },
  { 
    product: "FoodServe Plus", 
    domain: "food.client2.com",
    licenseKey: "FS-XXXX-XXXX-5678",
    status: "active",
    expiry: "2024-06-15",
    type: "Yearly"
  },
  { 
    product: "HotelHub Enterprise", 
    domain: "hotel.client3.com",
    licenseKey: "HH-XXXX-XXXX-9012",
    status: "expired",
    expiry: "2024-01-01",
    type: "Yearly"
  },
  { 
    product: "StockFlow Advanced", 
    domain: "stock.client4.com",
    licenseKey: "SF-XXXX-XXXX-3456",
    status: "frozen",
    expiry: "N/A",
    type: "Lifetime"
  },
  { 
    product: "SalonPro Suite", 
    domain: "salon.client5.com",
    licenseKey: "SP-XXXX-XXXX-7890",
    status: "active",
    expiry: "2025-03-20",
    type: "Yearly"
  },
];

export const LicenseDomain = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">License & Domain</h1>
          <p className="text-muted-foreground">Manage licenses and domain bindings</p>
        </div>
        <Button className="gap-2 bg-gradient-to-r from-violet-500 to-purple-500">
          <Key className="w-4 h-4" />
          Generate New License
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Licenses", value: licenses.length, icon: Key, color: "from-violet-500 to-purple-500" },
          { label: "Active", value: licenses.filter(l => l.status === "active").length, icon: Shield, color: "from-emerald-500 to-teal-500" },
          { label: "Expired", value: licenses.filter(l => l.status === "expired").length, icon: Calendar, color: "from-red-500 to-orange-500" },
          { label: "Frozen", value: licenses.filter(l => l.status === "frozen").length, icon: Lock, color: "from-amber-500 to-orange-500" },
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

      {/* License List */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5 text-violet-400" />
            License Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {licenses.map((license, index) => (
              <motion.div
                key={license.licenseKey}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border/50"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    license.status === "active" ? "bg-emerald-500/20" :
                    license.status === "expired" ? "bg-red-500/20" : "bg-amber-500/20"
                  }`}>
                    <Key className={`w-5 h-5 ${
                      license.status === "active" ? "text-emerald-400" :
                      license.status === "expired" ? "text-red-400" : "text-amber-400"
                    }`} />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{license.product}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <Globe className="w-3 h-3" />
                      {license.domain}
                    </div>
                    <div className="text-xs text-violet-400 font-mono">{license.licenseKey}</div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <Badge variant="outline">{license.type}</Badge>
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">{license.expiry}</div>
                    <div className="text-xs text-muted-foreground">Expiry</div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={
                      license.status === "active" ? "text-emerald-400 border-emerald-400/30" :
                      license.status === "expired" ? "text-red-400 border-red-400/30" :
                      "text-amber-400 border-amber-400/30"
                    }
                  >
                    {license.status}
                  </Badge>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" className="gap-1">
                      <RefreshCw className="w-3 h-3" />
                      Regenerate
                    </Button>
                    <Button size="sm" variant="ghost" className="gap-1">
                      <Lock className="w-3 h-3" />
                      Freeze
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Domain Lock Settings */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-400" />
            Domain Lock Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-background/50 border border-border/50">
              <div className="font-medium text-foreground mb-2">Single Domain Lock</div>
              <div className="text-sm text-muted-foreground mb-3">
                License works only on the registered domain
              </div>
              <Badge variant="outline" className="text-emerald-400 border-emerald-400/30">
                Enabled by Default
              </Badge>
            </div>
            <div className="p-4 rounded-lg bg-background/50 border border-border/50">
              <div className="font-medium text-foreground mb-2">Multi-Domain License</div>
              <div className="text-sm text-muted-foreground mb-3">
                License works on multiple registered domains
              </div>
              <Badge variant="outline" className="text-amber-400 border-amber-400/30">
                Enterprise Only
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
