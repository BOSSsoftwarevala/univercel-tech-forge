import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Key, 
  Plus, 
  Copy, 
  Check, 
  Clock, 
  Shield,
  Store,
  RefreshCw,
  Trash2,
  Eye,
  EyeOff,
  Calendar
} from "lucide-react";

interface FranchiseKey {
  id: string;
  key_code: string;
  franchise_name: string;
  region: string;
  status: string;
  validity_days: number;
  created_at: string;
  activated_at: string | null;
  expires_at: string | null;
  assigned_to: string | null;
}

const FranchiseKeyGenerator = () => {
  const queryClient = useQueryClient();
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [newKey, setNewKey] = useState({
    franchise_name: '',
    region: '',
    validity_days: 365,
    tier: 'standard'
  });

  // Generate unique key code
  const generateKeyCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const segments = [];
    for (let i = 0; i < 4; i++) {
      let segment = '';
      for (let j = 0; j < 4; j++) {
        segment += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      segments.push(segment);
    }
    return `FR-${segments.join('-')}`;
  };

  // Mock data - in real app, this would come from database
  const [keys, setKeys] = useState<FranchiseKey[]>([
    {
      id: '1',
      key_code: 'FR-ABCD-1234-EFGH-5678',
      franchise_name: 'Mumbai Central',
      region: 'Maharashtra',
      status: 'active',
      validity_days: 365,
      created_at: new Date().toISOString(),
      activated_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      assigned_to: 'user-123'
    },
    {
      id: '2',
      key_code: 'FR-WXYZ-9876-LMNO-5432',
      franchise_name: 'Delhi North',
      region: 'Delhi NCR',
      status: 'pending',
      validity_days: 365,
      created_at: new Date().toISOString(),
      activated_at: null,
      expires_at: null,
      assigned_to: null
    },
    {
      id: '3',
      key_code: 'FR-PQRS-1122-TUVW-3344',
      franchise_name: 'Bangalore Tech',
      region: 'Karnataka',
      status: 'expired',
      validity_days: 365,
      created_at: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString(),
      activated_at: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString(),
      expires_at: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
      assigned_to: 'user-456'
    }
  ]);

  const handleGenerateKey = () => {
    const keyCode = generateKeyCode();
    const newKeyData: FranchiseKey = {
      id: crypto.randomUUID(),
      key_code: keyCode,
      franchise_name: newKey.franchise_name,
      region: newKey.region,
      status: 'pending',
      validity_days: newKey.validity_days,
      created_at: new Date().toISOString(),
      activated_at: null,
      expires_at: null,
      assigned_to: null
    };

    setKeys(prev => [newKeyData, ...prev]);
    toast.success('Franchise key generated successfully!');
    setShowGenerateDialog(false);
    setNewKey({ franchise_name: '', region: '', validity_days: 365, tier: 'standard' });
  };

  const handleCopyKey = (keyCode: string) => {
    navigator.clipboard.writeText(keyCode);
    setCopiedKey(keyCode);
    toast.success('Key copied to clipboard');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRevokeKey = (keyId: string) => {
    setKeys(prev => prev.map(k => 
      k.id === keyId ? { ...k, status: 'revoked' } : k
    ));
    toast.success('Key revoked successfully');
  };

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys(prev => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Active</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pending</Badge>;
      case 'expired':
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Expired</Badge>;
      case 'revoked':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Revoked</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const activeKeys = keys.filter(k => k.status === 'active').length;
  const pendingKeys = keys.filter(k => k.status === 'pending').length;
  const expiredKeys = keys.filter(k => k.status === 'expired').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Key className="w-6 h-6 text-primary" />
            Franchise Key Generator
          </h2>
          <p className="text-muted-foreground">Generate and manage franchise activation keys</p>
        </div>
        <Button onClick={() => setShowGenerateDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Generate New Key
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div whileHover={{ scale: 1.02 }}>
          <Card className="bg-card/50 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Keys</p>
                  <p className="text-2xl font-bold">{keys.length}</p>
                </div>
                <Key className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }}>
          <Card className="bg-card/50 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-green-400">{activeKeys}</p>
                </div>
                <Shield className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }}>
          <Card className="bg-card/50 border-yellow-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-yellow-400">{pendingKeys}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }}>
          <Card className="bg-card/50 border-gray-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Expired</p>
                  <p className="text-2xl font-bold text-gray-400">{expiredKeys}</p>
                </div>
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Keys Table */}
      <Card className="bg-card/50 border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="w-5 h-5 text-primary" />
            Franchise Keys
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Key Code</TableHead>
                <TableHead>Franchise</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Validity</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keys.map((key) => (
                <TableRow key={key.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-secondary/50 px-2 py-1 rounded font-mono">
                        {showKeys[key.id] ? key.key_code : key.key_code.replace(/[A-Z0-9]/g, '•')}
                      </code>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={() => toggleKeyVisibility(key.id)}
                      >
                        {showKeys[key.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{key.franchise_name}</TableCell>
                  <TableCell>{key.region}</TableCell>
                  <TableCell>{getStatusBadge(key.status)}</TableCell>
                  <TableCell>{key.validity_days} days</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {key.expires_at ? new Date(key.expires_at).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-7 w-7"
                        onClick={() => handleCopyKey(key.key_code)}
                      >
                        {copiedKey === key.key_code ? (
                          <Check className="w-3 h-3 text-green-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </Button>
                      {key.status !== 'revoked' && key.status !== 'expired' && (
                        <Button
                          size="icon"
                          variant="destructive"
                          className="h-7 w-7"
                          onClick={() => handleRevokeKey(key.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Generate Key Dialog */}
      <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" />
              Generate Franchise Key
            </DialogTitle>
            <DialogDescription>
              Create a new activation key for a franchise partner
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Franchise Name</Label>
              <Input
                placeholder="e.g., Mumbai Central"
                value={newKey.franchise_name}
                onChange={(e) => setNewKey(prev => ({ ...prev, franchise_name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Region</Label>
              <Input
                placeholder="e.g., Maharashtra"
                value={newKey.region}
                onChange={(e) => setNewKey(prev => ({ ...prev, region: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Validity Period</Label>
                <Select
                  value={newKey.validity_days.toString()}
                  onValueChange={(value) => setNewKey(prev => ({ ...prev, validity_days: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="90">90 Days</SelectItem>
                    <SelectItem value="180">180 Days</SelectItem>
                    <SelectItem value="365">1 Year</SelectItem>
                    <SelectItem value="730">2 Years</SelectItem>
                    <SelectItem value="1825">5 Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tier</Label>
                <Select
                  value={newKey.tier}
                  onValueChange={(value) => setNewKey(prev => ({ ...prev, tier: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowGenerateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleGenerateKey} disabled={!newKey.franchise_name || !newKey.region}>
              <Key className="w-4 h-4 mr-2" />
              Generate Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FranchiseKeyGenerator;
