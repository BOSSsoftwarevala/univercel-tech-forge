import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  DollarSign, 
  Edit, 
  Check,
  Infinity,
  Calendar,
  Settings2
} from "lucide-react";

const pricingPlans = [
  { 
    product: "RetailMaster Pro", 
    lifetime: "$2,499", 
    yearly: "$899/yr", 
    custom: "Contact",
    franchiseCut: "30%"
  },
  { 
    product: "FoodServe Plus", 
    lifetime: "$1,999", 
    yearly: "$699/yr", 
    custom: "$1,499",
    franchiseCut: "25%"
  },
  { 
    product: "HotelHub Enterprise", 
    lifetime: "$3,499", 
    yearly: "$1,299/yr", 
    custom: "Contact",
    franchiseCut: "35%"
  },
  { 
    product: "StockFlow Advanced", 
    lifetime: "$1,799", 
    yearly: "$649/yr", 
    custom: "$1,299",
    franchiseCut: "25%"
  },
  { 
    product: "SalonPro Suite", 
    lifetime: "$1,299", 
    yearly: "$499/yr", 
    custom: "$999",
    franchiseCut: "20%"
  },
];

export const PricingPlans = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pricing & Plans</h1>
          <p className="text-muted-foreground">Manage product pricing and license types</p>
        </div>
        <Button className="gap-2 bg-gradient-to-r from-violet-500 to-purple-500">
          <DollarSign className="w-4 h-4" />
          Bulk Update Prices
        </Button>
      </div>

      {/* Plan Types */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { type: "Lifetime", icon: Infinity, desc: "One-time payment, forever access", color: "from-violet-500 to-purple-500" },
          { type: "Yearly", icon: Calendar, desc: "Annual subscription renewal", color: "from-blue-500 to-cyan-500" },
          { type: "Custom", icon: Settings2, desc: "Negotiated enterprise deals", color: "from-amber-500 to-orange-500" },
        ].map((plan, index) => {
          const Icon = plan.icon;
          return (
            <motion.div
              key={plan.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-card/50 border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${plan.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{plan.type} Plan</div>
                      <div className="text-xs text-muted-foreground">{plan.desc}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Pricing Table */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            Product Pricing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pricingPlans.map((item, index) => (
              <motion.div
                key={item.product}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border/50 hover:border-violet-500/30 transition-all"
              >
                <div className="font-medium text-foreground">{item.product}</div>
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <div className="text-sm font-medium text-foreground">{item.lifetime}</div>
                    <div className="text-xs text-muted-foreground">Lifetime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-foreground">{item.yearly}</div>
                    <div className="text-xs text-muted-foreground">Yearly</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-foreground">{item.custom}</div>
                    <div className="text-xs text-muted-foreground">Custom</div>
                  </div>
                  <Badge variant="outline" className="text-emerald-400 border-emerald-400/30">
                    {item.franchiseCut} cut
                  </Badge>
                  <Button size="sm" variant="ghost" className="gap-1">
                    <Edit className="w-3 h-3" />
                    Edit
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Region Pricing */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle>Region-based Pricing Adjustments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { region: "Africa", adjustment: "-20%", reason: "Market entry pricing" },
              { region: "Middle East", adjustment: "+10%", reason: "Premium positioning" },
              { region: "Asia", adjustment: "-15%", reason: "Volume discount" },
            ].map((item, index) => (
              <motion.div
                key={item.region}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg bg-background/50 border border-border/50"
              >
                <div className="font-medium text-foreground mb-1">{item.region}</div>
                <div className={`text-lg font-bold ${item.adjustment.startsWith('-') ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {item.adjustment}
                </div>
                <div className="text-xs text-muted-foreground">{item.reason}</div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
