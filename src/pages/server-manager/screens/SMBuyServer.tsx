import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, Globe, Settings, CreditCard, CheckCircle2,
  Server, Shield, Database, Clock, ArrowRight, ArrowLeft
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';

const steps = ['Select Plan', 'Select Region', 'Configuration', 'Billing'];

const regions = [
  { code: 'IN', name: 'Mumbai, India', latency: 12, compliance: ['GDPR', 'ISO'] },
  { code: 'SG', name: 'Singapore', latency: 35, compliance: ['GDPR', 'SOC2'] },
  { code: 'US', name: 'Virginia, US', latency: 180, compliance: ['HIPAA', 'SOC2'] },
  { code: 'EU', name: 'Frankfurt, EU', latency: 145, compliance: ['GDPR', 'ISO'] },
];

const SMBuyServer = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState('compute-m');
  const [selectedRegion, setSelectedRegion] = useState('IN');
  const [config, setConfig] = useState({
    os: 'ubuntu-22',
    autoBackup: true,
    firewall: 'standard',
    autoScale: false,
  });

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePurchase = () => {
    toast.success('Server purchase initiated! Check your billing for details.');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Buy New Server</h1>
        <p className="text-slate-400">Configure and purchase a new server instance</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, i) => (
          <div key={step} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              i <= currentStep ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400' : 'border-slate-600 text-slate-400'
            }`}>
              {i < currentStep ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
            </div>
            <span className={`ml-2 ${i <= currentStep ? 'text-white' : 'text-slate-500'}`}>{step}</span>
            {i < steps.length - 1 && (
              <div className={`w-16 h-0.5 mx-4 ${i < currentStep ? 'bg-cyan-500' : 'bg-slate-700'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card className="bg-slate-900/50 border-cyan-500/20">
        <CardContent className="p-6">
          {currentStep === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 className="text-lg font-semibold text-white mb-4">Select a Plan</h3>
              <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan}>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 'compute-s', name: 'Compute S', specs: '2 vCPU, 4 GB RAM', price: '₹1,999/mo' },
                    { id: 'compute-m', name: 'Compute M', specs: '4 vCPU, 8 GB RAM', price: '₹3,999/mo' },
                    { id: 'memory-l', name: 'Memory L', specs: '4 vCPU, 32 GB RAM', price: '₹7,999/mo' },
                    { id: 'storage-xl', name: 'Storage XL', specs: '2 vCPU, 1 TB SSD', price: '₹5,999/mo' },
                  ].map((plan) => (
                    <div key={plan.id} className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedPlan === plan.id ? 'border-cyan-500 bg-cyan-500/10' : 'border-slate-700 hover:border-slate-500'
                    }`} onClick={() => setSelectedPlan(plan.id)}>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value={plan.id} />
                        <div>
                          <p className="text-white font-medium">{plan.name}</p>
                          <p className="text-slate-400 text-sm">{plan.specs}</p>
                          <p className="text-cyan-400 font-semibold mt-1">{plan.price}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 className="text-lg font-semibold text-white mb-4">Select Region</h3>
              <RadioGroup value={selectedRegion} onValueChange={setSelectedRegion}>
                <div className="space-y-3">
                  {regions.map((region) => (
                    <div key={region.code} className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedRegion === region.code ? 'border-cyan-500 bg-cyan-500/10' : 'border-slate-700 hover:border-slate-500'
                    }`} onClick={() => setSelectedRegion(region.code)}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value={region.code} />
                          <div>
                            <div className="flex items-center gap-2">
                              <Globe className="w-4 h-4 text-cyan-400" />
                              <p className="text-white font-medium">{region.name}</p>
                              <Badge variant="outline" className="border-slate-600 text-slate-400">
                                {region.code}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              {region.compliance.map(c => (
                                <Badge key={c} className="bg-emerald-500/20 text-emerald-400 text-xs">
                                  {c}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span className={`font-mono ${region.latency < 50 ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {region.latency}ms
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 className="text-lg font-semibold text-white mb-4">Configuration</h3>
              <div className="space-y-6">
                <div>
                  <Label className="text-slate-300">Operating System</Label>
                  <RadioGroup value={config.os} onValueChange={(v) => setConfig({...config, os: v})} className="mt-2">
                    <div className="grid grid-cols-3 gap-3">
                      {['ubuntu-22', 'debian-12', 'centos-9'].map((os) => (
                        <div key={os} className={`p-3 rounded-lg border text-center cursor-pointer ${
                          config.os === os ? 'border-cyan-500 bg-cyan-500/10' : 'border-slate-700'
                        }`} onClick={() => setConfig({...config, os})}>
                          <RadioGroupItem value={os} className="sr-only" />
                          <p className="text-white capitalize">{os.replace('-', ' ')}</p>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-4 rounded-lg border cursor-pointer ${
                    config.autoBackup ? 'border-cyan-500 bg-cyan-500/10' : 'border-slate-700'
                  }`} onClick={() => setConfig({...config, autoBackup: !config.autoBackup})}>
                    <div className="flex items-center gap-3">
                      <Database className={config.autoBackup ? 'text-cyan-400' : 'text-slate-400'} />
                      <div>
                        <p className="text-white font-medium">Auto Backup</p>
                        <p className="text-slate-400 text-sm">Daily automated backups</p>
                      </div>
                    </div>
                  </div>
                  <div className={`p-4 rounded-lg border cursor-pointer ${
                    config.autoScale ? 'border-cyan-500 bg-cyan-500/10' : 'border-slate-700'
                  }`} onClick={() => setConfig({...config, autoScale: !config.autoScale})}>
                    <div className="flex items-center gap-3">
                      <Settings className={config.autoScale ? 'text-cyan-400' : 'text-slate-400'} />
                      <div>
                        <p className="text-white font-medium">Auto Scaling</p>
                        <p className="text-slate-400 text-sm">Scale on demand</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-slate-300">Firewall Preset</Label>
                  <RadioGroup value={config.firewall} onValueChange={(v) => setConfig({...config, firewall: v})} className="mt-2">
                    <div className="grid grid-cols-3 gap-3">
                      {['minimal', 'standard', 'strict'].map((fw) => (
                        <div key={fw} className={`p-3 rounded-lg border text-center cursor-pointer ${
                          config.firewall === fw ? 'border-cyan-500 bg-cyan-500/10' : 'border-slate-700'
                        }`} onClick={() => setConfig({...config, firewall: fw})}>
                          <Shield className={`w-5 h-5 mx-auto mb-1 ${config.firewall === fw ? 'text-cyan-400' : 'text-slate-400'}`} />
                          <p className="text-white capitalize">{fw}</p>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 className="text-lg font-semibold text-white mb-4">Billing</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                  <h4 className="text-white font-medium mb-3">Order Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Plan</span>
                      <span className="text-white">Compute M</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Region</span>
                      <span className="text-white">{regions.find(r => r.code === selectedRegion)?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Auto Backup</span>
                      <span className="text-white">{config.autoBackup ? 'Enabled (+₹299/mo)' : 'Disabled'}</span>
                    </div>
                    <div className="border-t border-slate-700 pt-2 mt-2">
                      <div className="flex justify-between font-semibold">
                        <span className="text-slate-300">Total</span>
                        <span className="text-cyan-400">₹{config.autoBackup ? '4,298' : '3,999'}/mo</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                  <h4 className="text-white font-medium mb-3">Payment Method</h4>
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-cyan-500/30 bg-cyan-500/10">
                    <CreditCard className="w-5 h-5 text-cyan-400" />
                    <div>
                      <p className="text-white">Wallet Balance</p>
                      <p className="text-emerald-400 text-sm">₹25,000 available</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrev}
          disabled={currentStep === 0}
          className="border-slate-600 text-slate-300"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        {currentStep < steps.length - 1 ? (
          <Button onClick={handleNext} className="bg-cyan-500 hover:bg-cyan-600">
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handlePurchase} className="bg-emerald-500 hover:bg-emerald-600">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Confirm Purchase
          </Button>
        )}
      </div>
    </div>
  );
};

export default SMBuyServer;
