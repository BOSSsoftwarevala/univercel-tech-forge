import { useState } from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, DollarSign, TrendingUp, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

const tiers = [
  { name: 'Bronze', price: 100000, commission: 15, leads: 50 },
  { name: 'Silver', price: 250000, commission: 20, leads: 150 },
  { name: 'Gold', price: 500000, commission: 25, leads: 300 },
  { name: 'Platinum', price: 1000000, commission: 30, leads: 500 }
];

const EarningModel = () => {
  const [tierIndex, setTierIndex] = useState(1);
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [monthlySales, setMonthlySales] = useState([5]);

  const currentTier = tiers[tierIndex];
  const exchangeRate = 83;
  const avgDealSize = currency === 'INR' ? 50000 : 600;
  const monthlyEarnings = monthlySales[0] * avgDealSize * (currentTier.commission / 100);
  const yearlyEarnings = monthlyEarnings * 12;

  const formatCurrency = (amount: number) => {
    if (currency === 'INR') {
      if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
      if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
      return `₹${amount.toLocaleString()}`;
    }
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
    return `$${amount.toLocaleString()}`;
  };

  return (
    <section className="relative py-24 overflow-hidden" id="earnings">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-mono font-bold text-foreground mb-4">
            Earnings <span className="text-primary">Calculator</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See your potential earnings based on tier and sales performance
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="glass-panel-glow p-8 rounded-2xl">
            {/* Currency Toggle */}
            <div className="flex justify-center mb-8">
              <div className="glass-panel p-1 rounded-lg inline-flex">
                <button
                  onClick={() => setCurrency('INR')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                    currency === 'INR' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <IndianRupee className="w-4 h-4" /> INR
                </button>
                <button
                  onClick={() => setCurrency('USD')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                    currency === 'USD' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <DollarSign className="w-4 h-4" /> USD
                </button>
              </div>
            </div>

            {/* Tier Selector */}
            <div className="mb-8">
              <label className="text-sm text-muted-foreground mb-4 block text-center">
                Select Franchise Tier
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {tiers.map((tier, index) => (
                  <motion.button
                    key={tier.name}
                    onClick={() => setTierIndex(index)}
                    className={`p-4 rounded-xl border transition-all ${
                      tierIndex === index
                        ? 'bg-primary/20 border-primary/50 shadow-[0_0_20px_rgba(0,240,255,0.2)]'
                        : 'bg-secondary/30 border-border/30 hover:border-primary/30'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <p className="font-mono font-bold text-foreground">{tier.name}</p>
                    <p className="text-xl font-bold text-primary mt-1">
                      {formatCurrency(currency === 'INR' ? tier.price : tier.price / exchangeRate)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{tier.commission}% commission</p>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Monthly Sales Slider */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <label className="text-sm text-muted-foreground">Monthly Sales</label>
                <span className="text-lg font-mono font-bold text-primary">{monthlySales[0]} deals</span>
              </div>
              <Slider
                value={monthlySales}
                onValueChange={setMonthlySales}
                max={30}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>1 deal</span>
                <span>30 deals</span>
              </div>
            </div>

            {/* Earnings Display */}
            <div className="grid md:grid-cols-3 gap-6">
              <motion.div
                className="glass-panel p-6 text-center border border-border/30"
                animate={{ borderColor: ['hsla(187, 100%, 50%, 0.3)', 'hsla(187, 100%, 50%, 0.6)', 'hsla(187, 100%, 50%, 0.3)'] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <p className="text-sm text-muted-foreground mb-2">Commission Rate</p>
                <p className="text-4xl font-mono font-bold text-primary">{currentTier.commission}%</p>
              </motion.div>

              <motion.div
                className="glass-panel p-6 text-center border border-neon-teal/30"
                animate={{ borderColor: ['hsla(174, 100%, 45%, 0.3)', 'hsla(174, 100%, 45%, 0.6)', 'hsla(174, 100%, 45%, 0.3)'] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              >
                <p className="text-sm text-muted-foreground mb-2">Monthly Earnings</p>
                <motion.p
                  key={monthlyEarnings}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-4xl font-mono font-bold text-neon-teal"
                >
                  {formatCurrency(monthlyEarnings)}
                </motion.p>
              </motion.div>

              <motion.div
                className="glass-panel p-6 text-center border border-neon-green/30"
                animate={{ borderColor: ['hsla(142, 76%, 50%, 0.3)', 'hsla(142, 76%, 50%, 0.6)', 'hsla(142, 76%, 50%, 0.3)'] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              >
                <p className="text-sm text-muted-foreground mb-2">Yearly Earnings</p>
                <motion.p
                  key={yearlyEarnings}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-4xl font-mono font-bold text-neon-green"
                >
                  {formatCurrency(yearlyEarnings)}
                </motion.p>
              </motion.div>
            </div>

            {/* CTA */}
            <div className="text-center mt-8">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-neon-teal text-background font-semibold px-8"
              >
                <Calculator className="w-4 h-4 mr-2" />
                Apply for {currentTier.name} Tier
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Background */}
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-64 h-64 bg-neon-teal/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
    </section>
  );
};

export default EarningModel;
