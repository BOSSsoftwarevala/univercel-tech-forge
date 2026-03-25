import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';

const CommissionSimulator = () => {
  const [leadsPerMonth, setLeadsPerMonth] = useState([20]);
  const [conversionRate, setConversionRate] = useState([15]);
  
  const commissionRate = 0.15; // 15%
  const avgDealValue = 50000; // ₹50,000
  
  const conversions = Math.round((leadsPerMonth[0] * conversionRate[0]) / 100);
  const monthlyEarnings = conversions * avgDealValue * commissionRate;
  const yearlyEarnings = monthlyEarnings * 12;

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount.toLocaleString()}`;
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
            Commission <span className="text-neon-blue">Simulator</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See how much you can earn based on your performance
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="glass-panel-glow p-8 rounded-2xl">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Input Controls */}
              <div className="space-y-8">
                {/* Leads Per Month */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-sm text-muted-foreground">Leads Generated Per Month</label>
                    <span className="text-lg font-mono font-bold text-neon-blue">{leadsPerMonth[0]}</span>
                  </div>
                  <Slider
                    value={leadsPerMonth}
                    onValueChange={setLeadsPerMonth}
                    max={100}
                    min={5}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>5 leads</span>
                    <span>100 leads</span>
                  </div>
                </div>

                {/* Conversion Rate */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-sm text-muted-foreground">Conversion Rate</label>
                    <span className="text-lg font-mono font-bold text-neon-teal">{conversionRate[0]}%</span>
                  </div>
                  <Slider
                    value={conversionRate}
                    onValueChange={setConversionRate}
                    max={50}
                    min={5}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>5%</span>
                    <span>50%</span>
                  </div>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-panel p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Avg Deal Value</p>
                    <p className="font-mono font-bold text-foreground">₹50,000</p>
                  </div>
                  <div className="glass-panel p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Commission Rate</p>
                    <p className="font-mono font-bold text-neon-green">15%</p>
                  </div>
                </div>
              </div>

              {/* Results Display */}
              <div className="space-y-6">
                {/* Conversions */}
                <motion.div
                  className="glass-panel p-6 text-center border border-neon-blue/30"
                  animate={{
                    borderColor: ['hsla(217, 91%, 60%, 0.3)', 'hsla(217, 91%, 60%, 0.6)', 'hsla(217, 91%, 60%, 0.3)']
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <p className="text-sm text-muted-foreground mb-2">Expected Conversions</p>
                  <motion.p
                    key={conversions}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-4xl font-mono font-bold text-neon-blue"
                  >
                    {conversions}
                  </motion.p>
                  <p className="text-xs text-muted-foreground mt-1">deals per month</p>
                </motion.div>

                {/* Monthly Earnings */}
                <motion.div
                  className="glass-panel p-6 text-center border border-neon-green/30"
                  animate={{
                    borderColor: ['hsla(142, 76%, 50%, 0.3)', 'hsla(142, 76%, 50%, 0.6)', 'hsla(142, 76%, 50%, 0.3)']
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >
                  <p className="text-sm text-muted-foreground mb-2">Monthly Earnings</p>
                  <motion.p
                    key={monthlyEarnings}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-4xl font-mono font-bold text-neon-green"
                  >
                    {formatCurrency(monthlyEarnings)}
                  </motion.p>
                  
                  {/* Animated Counter Effect */}
                  <motion.div
                    className="mt-2 flex items-center justify-center gap-2"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <TrendingUp className="w-4 h-4 text-neon-green" />
                    <span className="text-xs text-neon-green">Lifetime recurring</span>
                  </motion.div>
                </motion.div>

                {/* Yearly Projection */}
                <motion.div
                  className="glass-panel p-6 text-center border border-neon-purple/30"
                  animate={{
                    borderColor: ['hsla(280, 100%, 65%, 0.3)', 'hsla(280, 100%, 65%, 0.6)', 'hsla(280, 100%, 65%, 0.3)']
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                >
                  <p className="text-sm text-muted-foreground mb-2">Yearly Potential</p>
                  <motion.p
                    key={yearlyEarnings}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-4xl font-mono font-bold text-neon-purple"
                  >
                    {formatCurrency(yearlyEarnings)}
                  </motion.p>
                </motion.div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center mt-8 pt-6 border-t border-border/30">
              <Button
                size="lg"
                className="bg-gradient-to-r from-neon-blue to-primary text-background font-semibold px-10"
              >
                <Calculator className="w-4 h-4 mr-2" />
                Start Earning Today
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Background Elements */}
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-neon-blue/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-64 h-64 bg-neon-green/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
    </section>
  );
};

export default CommissionSimulator;
