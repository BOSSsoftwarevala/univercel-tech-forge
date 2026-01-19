/**
 * ADD NEW DEMO SCREEN
 * Create fully running software demo
 * LOCK: No modifications without approval
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Globe,
  Lock,
  User,
  Server,
  CheckCircle,
  Play,
  ExternalLink,
  Save,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const DMEAddDemoScreen: React.FC = () => {
  const [formData, setFormData] = useState({
    demoName: '',
    category: '',
    subCategory: '',
    demoUrl: '',
    loginId: '',
    password: '',
    role: '',
    status: 'active'
  });
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'failed' | null>(null);

  const categories = [
    'E-Commerce', 'CRM', 'ERP', 'HRM', 'Healthcare', 'Education', 'Real Estate', 'Logistics'
  ];

  const subCategories: Record<string, string[]> = {
    'E-Commerce': ['B2B Portal', 'B2C Store', 'Multi-vendor', 'Grocery'],
    'CRM': ['Sales CRM', 'Service CRM', 'Marketing CRM'],
    'ERP': ['Manufacturing', 'Retail', 'Distribution'],
    'HRM': ['Payroll', 'Attendance', 'Recruitment'],
    'Healthcare': ['Hospital', 'Clinic', 'Pharmacy'],
    'Education': ['School', 'College', 'LMS'],
    'Real Estate': ['Property Management', 'Listing Portal'],
    'Logistics': ['Fleet Management', 'Warehouse']
  };

  const techStack = 'React • Node.js • PostgreSQL • Redis • Docker';

  const handleTestLogin = async () => {
    setTesting(true);
    setTestResult(null);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setTestResult(formData.demoUrl && formData.loginId && formData.password ? 'success' : 'failed');
    setTesting(false);
  };

  const handleSaveDemo = () => {
    console.log('Saving demo:', formData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neon-green/20 flex items-center justify-center">
              <Plus className="w-5 h-5 text-neon-green" />
            </div>
            Add New Demo
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Create fully running software demo</p>
        </div>
        <Badge className="bg-neon-teal/20 text-neon-teal border-neon-teal/30">
          DEMO MANAGER
        </Badge>
      </div>

      {/* Form */}
      <div className="grid grid-cols-2 gap-6">
        {/* Left Column - Demo Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="p-6 rounded-xl bg-card border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4">Demo Details</h2>
            
            <div className="space-y-4">
              <div>
                <Label className="text-muted-foreground">Demo Name *</Label>
                <Input
                  placeholder="Enter demo name"
                  value={formData.demoName}
                  onChange={(e) => setFormData({ ...formData, demoName: e.target.value })}
                  className="mt-1 bg-background border-border"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(val) => setFormData({ ...formData, category: val, subCategory: '' })}
                  >
                    <SelectTrigger className="mt-1 bg-background border-border">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-muted-foreground">Sub Category *</Label>
                  <Select
                    value={formData.subCategory}
                    onValueChange={(val) => setFormData({ ...formData, subCategory: val })}
                    disabled={!formData.category}
                  >
                    <SelectTrigger className="mt-1 bg-background border-border">
                      <SelectValue placeholder="Select sub category" />
                    </SelectTrigger>
                    <SelectContent>
                      {(subCategories[formData.category] || []).map(sub => (
                        <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Demo URL *</Label>
                <div className="relative mt-1">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="https://demo.example.com"
                    value={formData.demoUrl}
                    onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                    className="pl-10 bg-background border-border"
                  />
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(val) => setFormData({ ...formData, status: val })}
                >
                  <SelectTrigger className="mt-1 bg-background border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="under-work">Under Work</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="p-4 rounded-xl bg-secondary/30 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Server className="w-4 h-4 text-neon-teal" />
              <span className="text-sm font-medium text-muted-foreground">Tech Stack (Read-only)</span>
            </div>
            <p className="text-sm font-mono text-foreground">{techStack}</p>
          </div>
        </motion.div>

        {/* Right Column - Login Credentials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <div className="p-6 rounded-xl bg-card border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4">Login Credentials</h2>
            
            <div className="space-y-4">
              <div>
                <Label className="text-muted-foreground">Login ID *</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="demo@example.com"
                    value={formData.loginId}
                    onChange={(e) => setFormData({ ...formData, loginId: e.target.value })}
                    className="pl-10 bg-background border-border"
                  />
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Password *</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10 bg-background border-border"
                  />
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Role Selector *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(val) => setFormData({ ...formData, role: val })}
                >
                  <SelectTrigger className="mt-1 bg-background border-border">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Test Result */}
            {testResult && (
              <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${
                testResult === 'success' 
                  ? 'bg-neon-green/10 border border-neon-green/30' 
                  : 'bg-red-500/10 border border-red-500/30'
              }`}>
                <CheckCircle className={`w-4 h-4 ${testResult === 'success' ? 'text-neon-green' : 'text-red-400'}`} />
                <span className={`text-sm ${testResult === 'success' ? 'text-neon-green' : 'text-red-400'}`}>
                  {testResult === 'success' ? 'Login test successful!' : 'Login test failed. Check credentials.'}
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="p-6 rounded-xl bg-card border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4">Actions</h2>
            <div className="space-y-3">
              <Button
                onClick={handleTestLogin}
                disabled={testing || !formData.demoUrl || !formData.loginId || !formData.password}
                className="w-full bg-neon-teal/20 text-neon-teal hover:bg-neon-teal/30 border border-neon-teal/30"
              >
                {testing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 mr-2" />
                )}
                Test Login
              </Button>
              <Button
                variant="outline"
                disabled={!formData.demoUrl}
                className="w-full border-border"
                onClick={() => window.open(formData.demoUrl, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Demo
              </Button>
              <Button
                onClick={handleSaveDemo}
                disabled={!formData.demoName || !formData.category || !formData.demoUrl}
                className="w-full bg-neon-green/20 text-neon-green hover:bg-neon-green/30 border border-neon-green/30"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Demo
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
