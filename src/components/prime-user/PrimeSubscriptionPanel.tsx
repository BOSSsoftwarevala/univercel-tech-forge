import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Crown, Calendar, CreditCard, RefreshCw, ArrowUp, 
  CheckCircle, Sparkles, Clock, Shield, Zap, Star
} from "lucide-react";

const PrimeSubscriptionPanel = () => {
  const subscription = {
    tier: "yearly",
    status: "active",
    startDate: "Jan 15, 2024",
    endDate: "Jan 15, 2025",
    daysRemaining: 27,
    autoRenewal: true,
    amount: "₹49,999",
    nextBilling: "Jan 15, 2025",
    paymentMethod: "Credit Card ending in 4242"
  };

  const tiers = [
    { 
      name: "Monthly", 
      price: "₹4,999", 
      period: "/month",
      features: ["Priority Queue", "2-Hour SLA", "Dedicated Support"],
      current: false
    },
    { 
      name: "Yearly", 
      price: "₹49,999", 
      period: "/year",
      features: ["All Monthly Features", "20% Savings", "Priority Dev Assignment", "VIP Badge"],
      current: true,
      popular: true
    },
    { 
      name: "Lifetime", 
      price: "₹1,99,999", 
      period: "one-time",
      features: ["All Yearly Features", "Forever Access", "Exclusive Beta Features", "Direct Manager Access"],
      current: false
    }
  ];

  const perks = [
    { icon: Zap, label: "Priority Queue", description: "Top of development stack" },
    { icon: Clock, label: "2-Hour SLA", description: "Guaranteed response time" },
    { icon: Shield, label: "Premium Support", description: "24/7 dedicated channel" },
    { icon: Star, label: "VIP Badge", description: "Exclusive recognition" },
    { icon: Sparkles, label: "Beta Access", description: "Early feature previews" },
    { icon: Crown, label: "Direct Access", description: "Manager escalation path" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-amber-100">Subscription & Billing</h2>
          <p className="text-stone-400">Manage your Prime membership</p>
        </div>
        <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-stone-900 px-4 py-1">
          <Crown className="w-4 h-4 mr-2" />
          PRIME ACTIVE
        </Badge>
      </div>

      {/* Current Subscription */}
      <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/30">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30"
              >
                <Crown className="w-8 h-8 text-stone-900" />
              </motion.div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-amber-100">Prime {subscription.tier.charAt(0).toUpperCase() + subscription.tier.slice(1)}</h3>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Active</Badge>
                </div>
                <p className="text-stone-400">Member since {subscription.startDate}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-amber-300">{subscription.daysRemaining}</div>
              <p className="text-sm text-stone-500">days remaining</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-3 rounded-lg bg-stone-900/50">
              <p className="text-xs text-stone-500 mb-1">Subscription Amount</p>
              <p className="text-lg font-bold text-amber-200">{subscription.amount}</p>
            </div>
            <div className="p-3 rounded-lg bg-stone-900/50">
              <p className="text-xs text-stone-500 mb-1">Valid Until</p>
              <p className="text-lg font-bold text-stone-200">{subscription.endDate}</p>
            </div>
            <div className="p-3 rounded-lg bg-stone-900/50">
              <p className="text-xs text-stone-500 mb-1">Next Billing</p>
              <p className="text-lg font-bold text-stone-200">{subscription.nextBilling}</p>
            </div>
            <div className="p-3 rounded-lg bg-stone-900/50">
              <p className="text-xs text-stone-500 mb-1">Payment Method</p>
              <p className="text-sm font-medium text-stone-200">{subscription.paymentMethod}</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-stone-900/50 border border-stone-700/50">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-amber-400" />
              <div>
                <p className="text-stone-200 font-medium">Auto-Renewal</p>
                <p className="text-sm text-stone-500">Automatically renew your subscription</p>
              </div>
            </div>
            <Switch checked={subscription.autoRenewal} />
          </div>
        </CardContent>
      </Card>

      {/* Subscription Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tiers.map((tier, index) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`h-full ${tier.current 
              ? "bg-gradient-to-br from-amber-500/20 to-amber-600/10 border-amber-500/40" 
              : "bg-stone-900/50 border-stone-700/50"
            }`}>
              <CardContent className="p-6">
                {tier.popular && (
                  <Badge className="mb-4 bg-amber-500 text-stone-900">Most Popular</Badge>
                )}
                <h3 className="text-xl font-bold text-amber-100 mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-bold text-amber-300">{tier.price}</span>
                  <span className="text-stone-500">{tier.period}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-stone-300">
                      <CheckCircle className="w-4 h-4 text-amber-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
                {tier.current ? (
                  <Button disabled className="w-full bg-stone-700 text-stone-400">
                    Current Plan
                  </Button>
                ) : (
                  <Button className="w-full bg-amber-500 hover:bg-amber-600 text-stone-900">
                    <ArrowUp className="w-4 h-4 mr-2" />
                    {tier.name === "Lifetime" ? "Upgrade" : "Switch Plan"}
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Active Perks */}
      <Card className="bg-stone-900/50 border-amber-500/20">
        <CardHeader>
          <CardTitle className="text-amber-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            Your Active Prime Perks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {perks.map((perk, index) => {
              const Icon = perk.icon;
              return (
                <motion.div
                  key={perk.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-xl bg-stone-800/50 border border-amber-500/10 hover:border-amber-500/30 transition-colors"
                >
                  <Icon className="w-6 h-6 text-amber-400 mb-2" />
                  <h4 className="text-stone-200 font-medium">{perk.label}</h4>
                  <p className="text-sm text-stone-500">{perk.description}</p>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Payment Actions */}
      <div className="flex gap-4">
        <Button variant="outline" className="border-amber-500/30 text-amber-300 hover:bg-amber-500/10">
          <CreditCard className="w-4 h-4 mr-2" />
          Update Payment Method
        </Button>
        <Button variant="outline" className="border-amber-500/30 text-amber-300 hover:bg-amber-500/10">
          <Calendar className="w-4 h-4 mr-2" />
          View Billing History
        </Button>
      </div>
    </div>
  );
};

export default PrimeSubscriptionPanel;
