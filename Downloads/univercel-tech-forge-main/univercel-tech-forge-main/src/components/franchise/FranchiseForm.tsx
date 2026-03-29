import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Building2, User, Mail, Phone, MapPin, Percent, DollarSign, ToggleLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Franchise } from '@/pages/FranchiseManagement';

interface FranchiseFormProps {
  franchise: Franchise | null;
  onSubmit: (data: Partial<Franchise>) => void;
  onClose: () => void;
}

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Chandigarh', 'Puducherry'
];

const FranchiseForm = ({ franchise, onSubmit, onClose }: FranchiseFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    ownerName: '',
    email: '',
    phone: '',
    state: '',
    city: '',
    territory: '',
    commission: 10,
    pricingVariation: 0,
    leadRouting: false
  });

  useEffect(() => {
    if (franchise) {
      setFormData({
        name: franchise.name,
        ownerName: franchise.ownerName,
        email: franchise.email,
        phone: franchise.phone,
        state: franchise.state,
        city: franchise.city,
        territory: franchise.territory,
        commission: franchise.commission,
        pricingVariation: franchise.pricingVariation,
        leadRouting: franchise.leadRouting
      });
    }
  }, [franchise]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isEditing = !!franchise;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl glass-panel-glow p-6 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-mono font-bold text-foreground">
                {isEditing ? 'Edit Franchise' : 'Create New Franchise'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {isEditing ? 'Update franchise details and territory' : 'Add a new franchise partner to the network'}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-wider">
              Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-primary" />
                  Franchise Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Tech Solutions Mumbai"
                  className="bg-secondary/50 border-border/50"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ownerName" className="flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Owner Name
                </Label>
                <Input
                  id="ownerName"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  placeholder="Full name of the owner"
                  className="bg-secondary/50 border-border/50"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="owner@franchise.com"
                  className="bg-secondary/50 border-border/50"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="bg-secondary/50 border-border/50"
                  required
                />
              </div>
            </div>
          </div>

          {/* Territory Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-wider">
              Territory Mapping
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="state" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  State
                </Label>
                <Select
                  value={formData.state}
                  onValueChange={(value) => setFormData({ ...formData, state: value })}
                >
                  <SelectTrigger className="bg-secondary/50 border-border/50">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {indianStates.map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="City name"
                  className="bg-secondary/50 border-border/50"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="territory">Territory Zone</Label>
                <Input
                  id="territory"
                  value={formData.territory}
                  onChange={(e) => setFormData({ ...formData, territory: e.target.value })}
                  placeholder="e.g., Maharashtra - West"
                  className="bg-secondary/50 border-border/50"
                  required
                />
              </div>
            </div>
          </div>

          {/* Commission & Pricing */}
          <div className="space-y-4">
            <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-wider">
              Commission & Pricing Rules
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="commission" className="flex items-center gap-2">
                  <Percent className="w-4 h-4 text-primary" />
                  Commission Rate (%)
                </Label>
                <Input
                  id="commission"
                  type="number"
                  min="0"
                  max="50"
                  value={formData.commission}
                  onChange={(e) => setFormData({ ...formData, commission: Number(e.target.value) })}
                  className="bg-secondary/50 border-border/50"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Standard range: 10-20%
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pricingVariation" className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-primary" />
                  State Pricing Variation (%)
                </Label>
                <Input
                  id="pricingVariation"
                  type="number"
                  min="0"
                  max="25"
                  value={formData.pricingVariation}
                  onChange={(e) => setFormData({ ...formData, pricingVariation: Number(e.target.value) })}
                  className="bg-secondary/50 border-border/50"
                />
                <p className="text-xs text-muted-foreground">
                  Allowed increase over base price
                </p>
              </div>
            </div>
          </div>

          {/* Lead Routing */}
          <div className="space-y-4">
            <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-wider">
              Sales Settings
            </h3>
            
            <div className="flex items-center justify-between glass-panel p-4">
              <div className="flex items-center gap-3">
                <ToggleLeft className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Lead Routing</p>
                  <p className="text-sm text-muted-foreground">
                    Automatically route leads from this territory to this franchise
                  </p>
                </div>
              </div>
              <Switch
                checked={formData.leadRouting}
                onCheckedChange={(checked) => setFormData({ ...formData, leadRouting: checked })}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/30">
            <Button type="button" variant="outline" onClick={onClose} className="command-button">
              Cancel
            </Button>
            <Button type="submit" className="command-button-primary">
              {isEditing ? 'Update Franchise' : 'Create Franchise'}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default FranchiseForm;
