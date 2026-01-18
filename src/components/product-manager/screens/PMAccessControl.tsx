import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import {
  Shield, Eye, Copy, Download, Edit3, UserCheck, Globe2,
  Lock, Unlock, Save, Users, Building2, MapPin
} from 'lucide-react';

interface PMAccessControlProps {
  permissionType: string;
}

const mockRoles = [
  { id: 'ROLE-001', name: 'Boss Owner', level: 1, permissions: { view: true, copy: true, download: true, edit: true } },
  { id: 'ROLE-002', name: 'CEO', level: 2, permissions: { view: true, copy: true, download: true, edit: true } },
  { id: 'ROLE-003', name: 'Product Manager', level: 3, permissions: { view: true, copy: true, download: true, edit: true } },
  { id: 'ROLE-004', name: 'Developer', level: 4, permissions: { view: true, copy: true, download: false, edit: false } },
  { id: 'ROLE-005', name: 'Franchise Manager', level: 5, permissions: { view: true, copy: false, download: false, edit: false } },
  { id: 'ROLE-006', name: 'Reseller', level: 6, permissions: { view: true, copy: false, download: false, edit: false } },
  { id: 'ROLE-007', name: 'Customer', level: 7, permissions: { view: true, copy: false, download: false, edit: false } },
];

const mockCountries = [
  { id: 'IN', name: 'India', enabled: true, franchises: 12 },
  { id: 'US', name: 'United States', enabled: true, franchises: 8 },
  { id: 'UK', name: 'United Kingdom', enabled: true, franchises: 5 },
  { id: 'AE', name: 'UAE', enabled: false, franchises: 3 },
  { id: 'SG', name: 'Singapore', enabled: true, franchises: 2 },
  { id: 'AU', name: 'Australia', enabled: false, franchises: 4 },
];

const PMAccessControl: React.FC<PMAccessControlProps> = ({ permissionType }) => {
  const [roles, setRoles] = useState(mockRoles);
  const [countries, setCountries] = useState(mockCountries);

  const getTitle = () => {
    switch (permissionType) {
      case 'view-permission': return 'View Permission';
      case 'copy-permission': return 'Copy Permission';
      case 'download-permission': return 'Download Permission';
      case 'edit-permission': return 'Edit Permission';
      case 'role-visibility': return 'Role Visibility';
      case 'country-control': return 'Country/Franchise Control';
      default: return 'Access Control';
    }
  };

  const getIcon = () => {
    switch (permissionType) {
      case 'view-permission': return Eye;
      case 'copy-permission': return Copy;
      case 'download-permission': return Download;
      case 'edit-permission': return Edit3;
      case 'role-visibility': return UserCheck;
      case 'country-control': return Globe2;
      default: return Shield;
    }
  };

  const handlePermissionToggle = (roleId: string, permission: string) => {
    setRoles(prev => prev.map(r => 
      r.id === roleId 
        ? { ...r, permissions: { ...r.permissions, [permission]: !r.permissions[permission as keyof typeof r.permissions] } }
        : r
    ));
    const role = roles.find(r => r.id === roleId);
    toast.success(`Permission updated`, {
      description: `${role?.name} - ${permission}`
    });
  };

  const handleCountryToggle = (countryId: string) => {
    setCountries(prev => prev.map(c => 
      c.id === countryId ? { ...c, enabled: !c.enabled } : c
    ));
    const country = countries.find(c => c.id === countryId);
    toast.success(`Country ${country?.enabled ? 'disabled' : 'enabled'}`, {
      description: country?.name
    });
  };

  const handleSave = () => {
    toast.success('Permissions saved successfully', {
      description: 'All changes have been applied'
    });
  };

  const Icon = getIcon();

  if (permissionType === 'country-control') {
    return (
      <div className="p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Globe2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{getTitle()}</h1>
              <p className="text-sm text-muted-foreground">
                Manage country and franchise access
              </p>
            </div>
          </div>
          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" /> Save Changes
          </Button>
        </motion.div>

        <ScrollArea className="h-[calc(100vh-14rem)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {countries.map((country, index) => (
              <motion.div
                key={country.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`bg-card/50 border-border/50 hover:border-emerald-500/30 transition-all ${!country.enabled && 'opacity-60'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center border border-emerald-500/30">
                          <MapPin className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                          <h3 className="font-medium">{country.name}</h3>
                          <p className="text-xs text-muted-foreground">{country.id}</p>
                        </div>
                      </div>
                      <Switch 
                        checked={country.enabled}
                        onCheckedChange={() => handleCountryToggle(country.id)}
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{country.franchises} Franchises</span>
                      </div>
                      <Badge variant={country.enabled ? 'default' : 'secondary'}>
                        {country.enabled ? 'Active' : 'Disabled'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  }

  const permissionKey = permissionType.replace('-permission', '') as 'view' | 'copy' | 'download' | 'edit';

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">{getTitle()}</h1>
            <p className="text-sm text-muted-foreground">
              Configure {permissionType.replace('-', ' ')} for each role
            </p>
          </div>
        </div>
        <Button onClick={handleSave} className="gap-2">
          <Save className="w-4 h-4" /> Save Changes
        </Button>
      </motion.div>

      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Users className="w-4 h-4" /> Role Permissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-20rem)]">
            <div className="space-y-3">
              {roles.map((role, index) => (
                <motion.div
                  key={role.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      L{role.level}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{role.name}</p>
                      <p className="text-xs text-muted-foreground">{role.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Switch 
                      checked={role.permissions[permissionKey]}
                      onCheckedChange={() => handlePermissionToggle(role.id, permissionKey)}
                    />
                    <Badge variant={role.permissions[permissionKey] ? 'default' : 'secondary'}>
                      {role.permissions[permissionKey] ? 'Allowed' : 'Denied'}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default PMAccessControl;
