/**
 * DEMO ACCESS SCREEN
 * Manage demo login credentials and access controls
 * LOCK: No modifications without approval
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  Key,
  Shield,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  Lock,
  User,
  Globe,
  AlertTriangle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const DMEDemoAccessScreen: React.FC = () => {
  const [showPasswords, setShowPasswords] = React.useState<Record<number, boolean>>({});

  const accessData = [
    { id: 1, demo: 'E-Commerce Pro', url: 'https://ecom-demo.softwarevala.com', loginId: 'admin@demo.com', password: 'Demo@123', role: 'Admin', lastAccess: '2 min ago' },
    { id: 2, demo: 'Hospital Management', url: 'https://hospital-demo.softwarevala.com', loginId: 'doctor@demo.com', password: 'Hospital@456', role: 'Doctor', lastAccess: '15 min ago' },
    { id: 3, demo: 'School ERP', url: 'https://school-demo.softwarevala.com', loginId: 'principal@demo.com', password: 'School@789', role: 'Principal', lastAccess: '1 hour ago' },
    { id: 4, demo: 'Sales CRM', url: 'https://crm-demo.softwarevala.com', loginId: 'manager@demo.com', password: 'Sales@321', role: 'Manager', lastAccess: '30 min ago' },
  ];

  const togglePassword = (id: number) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Key className="w-5 h-5 text-amber-400" />
            </div>
            Demo Access
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Manage login credentials & access controls</p>
        </div>
        <Badge className="bg-neon-teal/20 text-neon-teal border-neon-teal/30">
          SECURE ACCESS
        </Badge>
      </div>

      {/* Security Notice */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-400">Security Notice</p>
          <p className="text-xs text-muted-foreground mt-1">
            Login credentials are masked for clients. Only Demo Manager can view and manage access.
          </p>
        </div>
      </div>

      {/* Access Cards */}
      <div className="space-y-4">
        {accessData.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="p-5 rounded-xl bg-card border border-border"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-foreground">{item.demo}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                  <Globe className="w-3 h-3" />
                  {item.url}
                </p>
              </div>
              <Badge className="bg-neon-green/20 text-neon-green border-neon-green/30">
                {item.role}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* Login ID */}
              <div className="p-3 rounded-lg bg-secondary/30 border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Login ID</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono text-foreground">{item.loginId}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={() => copyToClipboard(item.loginId)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              {/* Password */}
              <div className="p-3 rounded-lg bg-secondary/30 border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Password</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono text-foreground">
                    {showPasswords[item.id] ? item.password : '••••••••'}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={() => togglePassword(item.id)}
                    >
                      {showPasswords[item.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={() => copyToClipboard(item.password)}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Last Access */}
              <div className="p-3 rounded-lg bg-secondary/30 border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Last Access</span>
                </div>
                <span className="text-sm text-foreground">{item.lastAccess}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-4">
              <Button size="sm" variant="outline" className="border-border">
                <RefreshCw className="w-3 h-3 mr-2" />
                Reset Password
              </Button>
              <Button size="sm" variant="outline" className="border-border">
                <Shield className="w-3 h-3 mr-2" />
                Revoke Access
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
