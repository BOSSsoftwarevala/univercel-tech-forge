import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Server, Plus, Globe, Cpu, HardDrive, MemoryStick, Shield, 
  CheckCircle, ArrowRight, Cloud, Database, Zap, Settings2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const serverTypes = [
  { id: 'web', name: 'Web Server', icon: Globe, desc: 'Nginx/Apache for hosting' },
  { id: 'app', name: 'Application', icon: Zap, desc: 'Node.js, Python, Java' },
  { id: 'db', name: 'Database', icon: Database, desc: 'PostgreSQL, MySQL, MongoDB' },
  { id: 'storage', name: 'Storage', icon: HardDrive, desc: 'File & Object Storage' },
];

const regions = [
  { id: 'us-east', name: 'US East (Virginia)', flag: '🇺🇸' },
  { id: 'us-west', name: 'US West (California)', flag: '🇺🇸' },
  { id: 'eu-central', name: 'EU Central (Frankfurt)', flag: '🇩🇪' },
  { id: 'eu-west', name: 'EU West (London)', flag: '🇬🇧' },
  { id: 'ap-tokyo', name: 'Asia Pacific (Tokyo)', flag: '🇯🇵' },
  { id: 'ap-mumbai', name: 'Asia Pacific (Mumbai)', flag: '🇮🇳' },
  { id: 'ap-singapore', name: 'Asia Pacific (Singapore)', flag: '🇸🇬' },
];

const plans = [
  { id: 'starter', name: 'Starter', cpu: '2 vCPU', ram: '4 GB', storage: '80 GB SSD', price: 20 },
  { id: 'pro', name: 'Professional', cpu: '4 vCPU', ram: '8 GB', storage: '160 GB SSD', price: 40 },
  { id: 'business', name: 'Business', cpu: '8 vCPU', ram: '16 GB', storage: '320 GB SSD', price: 80 },
  { id: 'enterprise', name: 'Enterprise', cpu: '16 vCPU', ram: '32 GB', storage: '640 GB SSD', price: 160 },
];

const SMAddServer = () => {
  const [step, setStep] = useState(1);
  const [serverConfig, setServerConfig] = useState({
    name: '',
    type: '',
    region: '',
    plan: '',
    autoBackup: true,
    monitoring: true,
    firewall: true,
    sshKey: '',
  });

  const handleCreate = () => {
    toast.success('Server provisioning started!');
    // Reset form
    setStep(1);
    setServerConfig({
      name: '',
      type: '',
      region: '',
      plan: '',
      autoBackup: true,
      monitoring: true,
      firewall: true,
      sshKey: '',
    });
  };

  const selectedPlan = plans.find(p => p.id === serverConfig.plan);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Plus className="w-6 h-6 text-cyan-400" />
            Add New Server
          </h2>
          <p className="text-slate-400 mt-1">Provision a new server in minutes</p>
        </div>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div 
              key={s}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                step === s 
                  ? 'bg-cyan-500 text-white' 
                  : step > s 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' 
                    : 'bg-slate-800 text-slate-500'
              }`}
            >
              {step > s ? <CheckCircle className="w-4 h-4" /> : s}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Server Type */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg text-white">Step 1: Select Server Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {serverTypes.map((type) => (
                  <motion.button
                    key={type.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setServerConfig(prev => ({ ...prev, type: type.id }))}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      serverConfig.type === type.id
                        ? 'border-cyan-500 bg-cyan-500/10'
                        : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                    }`}
                  >
                    <type.icon className={`w-8 h-8 mb-3 ${serverConfig.type === type.id ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <h3 className="font-semibold text-white">{type.name}</h3>
                    <p className="text-sm text-slate-400">{type.desc}</p>
                  </motion.button>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <Button 
                  onClick={() => setStep(2)} 
                  disabled={!serverConfig.type}
                  className="bg-cyan-600 hover:bg-cyan-700"
                >
                  Next <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Step 2: Region & Plan */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg text-white">Step 2: Choose Region & Plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Region Selection */}
              <div>
                <Label className="text-slate-300 mb-2 block">Select Region</Label>
                <Select 
                  value={serverConfig.region} 
                  onValueChange={(v) => setServerConfig(prev => ({ ...prev, region: v }))}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-600">
                    <SelectValue placeholder="Choose a region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region.id} value={region.id}>
                        <span className="flex items-center gap-2">
                          <span>{region.flag}</span>
                          <span>{region.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Plan Selection */}
              <div>
                <Label className="text-slate-300 mb-2 block">Select Plan</Label>
                <div className="grid grid-cols-2 gap-3">
                  {plans.map((plan) => (
                    <motion.button
                      key={plan.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setServerConfig(prev => ({ ...prev, plan: plan.id }))}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        serverConfig.plan === plan.id
                          ? 'border-cyan-500 bg-cyan-500/10'
                          : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-white">{plan.name}</h3>
                        <Badge className="bg-cyan-500/20 text-cyan-400">${plan.price}/mo</Badge>
                      </div>
                      <div className="space-y-1 text-sm text-slate-400">
                        <div className="flex items-center gap-2"><Cpu className="w-3 h-3" />{plan.cpu}</div>
                        <div className="flex items-center gap-2"><MemoryStick className="w-3 h-3" />{plan.ram}</div>
                        <div className="flex items-center gap-2"><HardDrive className="w-3 h-3" />{plan.storage}</div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)} className="border-slate-600">
                  Back
                </Button>
                <Button 
                  onClick={() => setStep(3)} 
                  disabled={!serverConfig.region || !serverConfig.plan}
                  className="bg-cyan-600 hover:bg-cyan-700"
                >
                  Next <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Step 3: Configuration */}
      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg text-white">Step 3: Server Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Server Name */}
              <div>
                <Label className="text-slate-300 mb-2 block">Server Name</Label>
                <Input
                  value={serverConfig.name}
                  onChange={(e) => setServerConfig(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="my-production-server"
                  className="bg-slate-800 border-slate-600"
                />
              </div>

              {/* Features */}
              <div className="space-y-4">
                <Label className="text-slate-300 block">Features</Label>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                  <div className="flex items-center gap-3">
                    <Database className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-white font-medium">Auto Backup</p>
                      <p className="text-xs text-slate-400">Daily automated backups</p>
                    </div>
                  </div>
                  <Switch 
                    checked={serverConfig.autoBackup}
                    onCheckedChange={(v) => setServerConfig(prev => ({ ...prev, autoBackup: v }))}
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <div>
                      <p className="text-white font-medium">24/7 Monitoring</p>
                      <p className="text-xs text-slate-400">Real-time health monitoring</p>
                    </div>
                  </div>
                  <Switch 
                    checked={serverConfig.monitoring}
                    onCheckedChange={(v) => setServerConfig(prev => ({ ...prev, monitoring: v }))}
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="text-white font-medium">Firewall Protection</p>
                      <p className="text-xs text-slate-400">Advanced DDoS protection</p>
                    </div>
                  </div>
                  <Switch 
                    checked={serverConfig.firewall}
                    onCheckedChange={(v) => setServerConfig(prev => ({ ...prev, firewall: v }))}
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)} className="border-slate-600">
                  Back
                </Button>
                <Button 
                  onClick={() => setStep(4)} 
                  disabled={!serverConfig.name}
                  className="bg-cyan-600 hover:bg-cyan-700"
                >
                  Next <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Step 4: Review & Confirm */}
      {step === 4 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg text-white">Step 4: Review & Confirm</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 rounded-xl bg-slate-800/50 space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">Server Name</span>
                  <span className="text-white font-medium">{serverConfig.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Type</span>
                  <span className="text-white font-medium capitalize">{serverConfig.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Region</span>
                  <span className="text-white font-medium">{regions.find(r => r.id === serverConfig.region)?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Plan</span>
                  <span className="text-white font-medium">{selectedPlan?.name} - ${selectedPlan?.price}/mo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Resources</span>
                  <span className="text-white font-medium">{selectedPlan?.cpu} • {selectedPlan?.ram} • {selectedPlan?.storage}</span>
                </div>
                <div className="border-t border-slate-700 pt-4 flex justify-between">
                  <span className="text-slate-400">Features</span>
                  <div className="flex gap-2">
                    {serverConfig.autoBackup && <Badge className="bg-blue-500/20 text-blue-400">Backup</Badge>}
                    {serverConfig.monitoring && <Badge className="bg-yellow-500/20 text-yellow-400">Monitor</Badge>}
                    {serverConfig.firewall && <Badge className="bg-green-500/20 text-green-400">Firewall</Badge>}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-cyan-400 font-semibold">Monthly Total</p>
                    <p className="text-xs text-slate-400">Billed monthly</p>
                  </div>
                  <p className="text-3xl font-bold text-white">${selectedPlan?.price}<span className="text-sm text-slate-400">/mo</span></p>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(3)} className="border-slate-600">
                  Back
                </Button>
                <Button 
                  onClick={handleCreate}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Server className="w-4 h-4 mr-2" />
                  Create Server
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default SMAddServer;
