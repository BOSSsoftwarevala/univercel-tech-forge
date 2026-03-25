import { motion } from "framer-motion";
import { Store, Zap, Bot, Search, BarChart3, Shield, Star, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const UpgradeStore = () => {
  const products = [
    {
      id: 1,
      name: "Automation Pack Pro",
      description: "Advanced workflow automation with 50+ pre-built templates",
      price: "$99/mo",
      originalPrice: "$149/mo",
      features: ["Unlimited Workflows", "Priority Execution", "Custom Triggers", "API Webhooks"],
      icon: Zap,
      popular: true,
      color: "amber"
    },
    {
      id: 2,
      name: "AI Assistant Suite",
      description: "AI-powered tools for content, analysis, and recommendations",
      price: "$149/mo",
      originalPrice: "$199/mo",
      features: ["GPT-4 Integration", "Custom Training", "Multi-language", "Unlimited Queries"],
      icon: Bot,
      popular: false,
      color: "purple"
    },
    {
      id: 3,
      name: "SEO Power Bundle",
      description: "Complete SEO toolkit with rank tracking and optimization",
      price: "$79/mo",
      originalPrice: "$119/mo",
      features: ["Keyword Research", "Rank Tracking", "Competitor Analysis", "Auto-Optimization"],
      icon: Search,
      popular: false,
      color: "blue"
    },
    {
      id: 4,
      name: "Analytics Enterprise",
      description: "Advanced reporting and business intelligence tools",
      price: "$199/mo",
      originalPrice: "$299/mo",
      features: ["Custom Dashboards", "Predictive Analytics", "Data Export", "White-label Reports"],
      icon: BarChart3,
      popular: true,
      color: "emerald"
    },
    {
      id: 5,
      name: "Security Shield",
      description: "Enterprise-grade security monitoring and compliance",
      price: "$129/mo",
      originalPrice: "$179/mo",
      features: ["24/7 Monitoring", "Threat Detection", "Compliance Reports", "Audit Logs"],
      icon: Shield,
      popular: false,
      color: "red"
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { border: string; bg: string; text: string; button: string }> = {
      amber: { border: "border-amber-500/30", bg: "bg-amber-500/20", text: "text-amber-400", button: "from-amber-500 to-amber-600" },
      purple: { border: "border-purple-500/30", bg: "bg-purple-500/20", text: "text-purple-400", button: "from-purple-500 to-purple-600" },
      blue: { border: "border-blue-500/30", bg: "bg-blue-500/20", text: "text-blue-400", button: "from-blue-500 to-blue-600" },
      emerald: { border: "border-emerald-500/30", bg: "bg-emerald-500/20", text: "text-emerald-400", button: "from-emerald-500 to-emerald-600" },
      red: { border: "border-red-500/30", bg: "bg-red-500/20", text: "text-red-400", button: "from-red-500 to-red-600" },
    };
    return colors[color] || colors.amber;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-amber-100">Exclusive Upgrade Store</h2>
          <p className="text-stone-400">Premium add-ons and power tools for VIP members</p>
        </div>
        <Badge className="bg-gradient-to-r from-amber-500/20 to-purple-500/20 text-amber-300 border border-amber-500/30 px-4 py-2">
          <Star className="w-4 h-4 mr-2 fill-amber-400 text-amber-400" />
          VIP Discounts Applied
        </Badge>
      </div>

      <Card className="bg-gradient-to-r from-purple-900/30 to-amber-900/30 border-purple-500/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-purple-100 mb-2">🎉 End of Year Sale</h3>
              <p className="text-stone-300">Get up to 35% off on all add-ons. Limited time offer!</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-amber-400">35%</div>
              <div className="text-sm text-stone-400">OFF</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, index) => {
          const Icon = product.icon;
          const colorClasses = getColorClasses(product.color);
          
          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`bg-stone-900/50 ${colorClasses.border} hover:border-opacity-60 transition-all h-full flex flex-col relative`}>
                {product.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                      <Star className="w-3 h-3 mr-1 fill-white" />
                      POPULAR
                    </Badge>
                  </div>
                )}
                <CardContent className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-xl ${colorClasses.bg} flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${colorClasses.text}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-amber-100">{product.name}</h3>
                      <p className="text-xs text-stone-400 mt-1">{product.description}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-amber-100">{product.price}</span>
                      <span className="text-sm text-stone-500 line-through">{product.originalPrice}</span>
                    </div>
                  </div>

                  <ul className="space-y-2 mb-4 flex-1">
                    {product.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-stone-300">
                        <Check className={`w-4 h-4 ${colorClasses.text}`} />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button className={`w-full bg-gradient-to-r ${colorClasses.button} text-white`}>
                    Add to Account
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Card className="bg-stone-900/50 border-amber-500/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-amber-100">Need a Custom Solution?</h3>
              <p className="text-stone-400">Contact us for enterprise packages and custom integrations</p>
            </div>
            <Button variant="outline" className="border-amber-500/30 text-amber-300 hover:bg-amber-500/10">
              Contact Sales
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpgradeStore;
