import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { 
  Globe2, Users, MapPin, Plus, Settings, Search,
  ChevronRight, Crown, Shield
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface Continent {
  id: string;
  name: string;
  countries: number;
  superAdmins: number;
  activeUsers: number;
  status: 'active' | 'restricted' | 'frozen';
}

interface SuperAdmin {
  id: string;
  user_id: string;
  name: string;
  continent: string;
  countries: string[];
  status: 'active' | 'suspended';
  last_active: string;
}

const continentData: Continent[] = [
  { id: '1', name: 'Asia', countries: 48, superAdmins: 5, activeUsers: 125000, status: 'active' },
  { id: '2', name: 'Europe', countries: 44, superAdmins: 4, activeUsers: 89000, status: 'active' },
  { id: '3', name: 'North America', countries: 23, superAdmins: 3, activeUsers: 67000, status: 'active' },
  { id: '4', name: 'South America', countries: 12, superAdmins: 2, activeUsers: 34000, status: 'active' },
  { id: '5', name: 'Africa', countries: 54, superAdmins: 3, activeUsers: 28000, status: 'restricted' },
  { id: '6', name: 'Oceania', countries: 14, superAdmins: 1, activeUsers: 15000, status: 'active' },
];

const GlobalStructureView = () => {
  const { user } = useAuth();
  const [continents, setContinents] = useState<Continent[]>(continentData);
  const [superAdmins, setSuperAdmins] = useState<SuperAdmin[]>([]);
  const [selectedContinent, setSelectedContinent] = useState<Continent | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  useEffect(() => {
    fetchSuperAdmins();
  }, []);

  const fetchSuperAdmins = async () => {
    const { data } = await supabase
      .from('super_admin')
      .select('*')
      .limit(50);

    const mapped = data?.map(sa => ({
      id: sa.id,
      user_id: sa.user_id,
      name: `SA-${sa.user_id.slice(0, 6)}`,
      continent: sa.assigned_continent || 'Global',
      countries: sa.assigned_countries || [],
      status: sa.status === 'active' ? 'active' as const : 'suspended' as const,
      last_active: sa.last_active_at || new Date().toISOString()
    })) || [];

    setSuperAdmins(mapped);
  };

  const handleAssignSuperAdmin = async (continentName: string) => {
    await supabase.from('audit_logs').insert({
      user_id: user?.id,
      role: 'master',
      module: 'global-structure',
      action: 'assign_super_admin',
      meta_json: { continent: continentName }
    });

    toast.success(`Super Admin assignment initiated for ${continentName}`);
    setIsAssignDialogOpen(false);
  };

  const handleRemoveSuperAdmin = async (adminId: string) => {
    await supabase.from('audit_logs').insert({
      user_id: user?.id,
      role: 'master',
      module: 'global-structure',
      action: 'remove_super_admin',
      meta_json: { admin_id: adminId }
    });

    toast.success('Super Admin removed');
    fetchSuperAdmins();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="bg-green-500/15 text-green-400 text-xs">Active</Badge>;
      case 'restricted':
        return <Badge variant="outline" className="bg-amber-500/15 text-amber-400 text-xs">Restricted</Badge>;
      case 'frozen':
        return <Badge variant="outline" className="bg-red-500/15 text-red-400 text-xs">Frozen</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-500/15 text-gray-400 text-xs">{status}</Badge>;
    }
  };

  const filteredAdmins = superAdmins.filter(sa =>
    sa.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sa.continent.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Globe2 className="w-7 h-7 text-teal-400" />
            Global Structure Control
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Continent management, Super Admin assignment & removal, global rules enforcement
          </p>
        </div>
        <Button
          onClick={() => setIsAssignDialogOpen(true)}
          className="gap-2 bg-teal-600 hover:bg-teal-700"
        >
          <Plus className="w-4 h-4" />
          Assign Super Admin
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-teal-500/10 to-transparent border-teal-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center">
              <Globe2 className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{continents.length}</p>
              <p className="text-xs text-gray-500">Continents</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Crown className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {continents.reduce((sum, c) => sum + c.superAdmins, 0)}
              </p>
              <p className="text-xs text-gray-500">Super Admins</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {continents.reduce((sum, c) => sum + c.countries, 0)}
              </p>
              <p className="text-xs text-gray-500">Countries</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {(continents.reduce((sum, c) => sum + c.activeUsers, 0) / 1000).toFixed(0)}K
              </p>
              <p className="text-xs text-gray-500">Active Users</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Continents */}
        <div className="col-span-5">
          <Card className="p-4 bg-[#0a0a12] border-gray-800/50 h-[450px]">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-teal-400" />
              Continent Management
            </h3>
            <ScrollArea className="h-[380px]">
              <div className="space-y-3">
                {continents.map((continent) => (
                  <div
                    key={continent.id}
                    onClick={() => setSelectedContinent(continent)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedContinent?.id === continent.id
                        ? 'bg-teal-500/10 border-teal-500/30'
                        : 'bg-gray-800/20 border-gray-800/50 hover:bg-gray-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-white">{continent.name}</h4>
                      {getStatusBadge(continent.status)}
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500">Countries</span>
                        <p className="text-white font-medium">{continent.countries}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Super Admins</span>
                        <p className="text-amber-400 font-medium">{continent.superAdmins}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Users</span>
                        <p className="text-cyan-400 font-medium">{(continent.activeUsers / 1000).toFixed(0)}K</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </div>

        {/* Super Admins */}
        <div className="col-span-7">
          <Card className="p-4 bg-[#0a0a12] border-gray-800/50 h-[450px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-400" />
                Super Admin Directory
              </h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className="pl-9 h-8 w-48 bg-gray-800/50 border-gray-700 text-xs"
                />
              </div>
            </div>
            <ScrollArea className="h-[380px]">
              <table className="w-full">
                <thead className="sticky top-0 bg-[#0a0a12]">
                  <tr className="text-left text-xs text-gray-500 border-b border-gray-800">
                    <th className="pb-3">Admin</th>
                    <th className="pb-3">Continent</th>
                    <th className="pb-3">Countries</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdmins.map((admin) => (
                    <tr key={admin.id} className="border-b border-gray-800/50 hover:bg-gray-800/20">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                            <Crown className="w-4 h-4 text-amber-400" />
                          </div>
                          <span className="text-sm text-white">{admin.name}</span>
                        </div>
                      </td>
                      <td className="py-3 text-sm text-gray-400">{admin.continent}</td>
                      <td className="py-3 text-sm text-gray-400">{admin.countries.length}</td>
                      <td className="py-3">{getStatusBadge(admin.status)}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2 text-gray-400 hover:text-white"
                          >
                            <Settings className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveSuperAdmin(admin.id)}
                            className="h-7 px-2 text-red-400 hover:bg-red-500/10"
                          >
                            Remove
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredAdmins.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-500">
                        No Super Admins found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </ScrollArea>
          </Card>
        </div>
      </div>

      {/* Global Rules Notice */}
      <Card className="p-4 bg-teal-500/5 border-teal-500/20">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-teal-400 mt-0.5" />
          <div>
            <p className="text-sm text-teal-400 font-medium">Global Rules Enforcement</p>
            <p className="text-xs text-gray-500 mt-1">
              All global rules are non-negotiable and enforced system-wide.
              Super Admins operate within their assigned continent boundaries.
              Master Admin retains absolute authority over all continents and can override any decision.
            </p>
          </div>
        </div>
      </Card>

      {/* Assign Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="bg-[#0a0a12] border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-teal-400" />
              Assign New Super Admin
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-400">
              Select a continent to assign a new Super Admin:
            </p>
            <div className="grid grid-cols-2 gap-3">
              {continents.map((continent) => (
                <Button
                  key={continent.id}
                  variant="outline"
                  onClick={() => handleAssignSuperAdmin(continent.name)}
                  className="justify-start gap-2 border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  <Globe2 className="w-4 h-4 text-teal-400" />
                  {continent.name}
                </Button>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAssignDialogOpen(false)}
              className="border-gray-700 text-gray-400"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GlobalStructureView;
