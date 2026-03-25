import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TopControlBar from '@/components/layout/TopControlBar';
import { useNavigate } from 'react-router-dom';
import FranchiseTable from '@/components/franchise/FranchiseTable';
import FranchiseFilters from '@/components/franchise/FranchiseFilters';
import FranchiseStats from '@/components/franchise/FranchiseStats';
import FranchiseForm from '@/components/franchise/FranchiseForm';
import TerritoryMap from '@/components/franchise/TerritoryMap';
import { Button } from '@/components/ui/button';
import {
  Plus,
  Map,
  List,
  Download,
  Upload,
  RefreshCcw
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { franchiseApi } from '@/lib/api/franchise';
import { useFranchiseControlSystem } from '@/hooks/useFranchiseControlSystem';

export interface Franchise {
  id: string;
  franchise_name: string;
  staff_count: number;
  leads: number;
  revenue: number;
  status: 'active' | 'pending' | 'suspended' | 'terminated';
  deep_analytics: {
    city: string;
    state?: string | null;
    risk_level?: string | null;
    wallet_locked?: boolean;
  };
  ai_suggestion: string | null;
  actions: {
    view: string;
    manage: string;
    hold: string;
  };
}

const FranchiseManagement = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'table' | 'map'>('table');
  const [showForm, setShowForm] = useState(false);
  const [selectedFranchise, setSelectedFranchise] = useState<Franchise | null>(null);
  const [editingFranchise, setEditingFranchise] = useState<Franchise | null>(null);
  const [filters, setFilters] = useState({
    status: 'all',
    state: 'all',
    search: ''
  });

  // Use real franchise control system
  const { dashboardQuery, createStoreMutation } = useFranchiseControlSystem();
  const [franchises, setFranchises] = useState<Franchise[]>([]);

  // Fetch franchises on mount
  useEffect(() => {
    const fetchFranchises = async () => {
      try {
        const response = await franchiseApi.getFranchiseList();
        setFranchises(response.items);
      } catch (error) {
        console.error('Failed to fetch franchises:', error);
        toast({
          title: "Error",
          description: "Failed to load franchises",
          variant: "destructive"
        });
      }
    };

    fetchFranchises();
  }, []);

  const handleView = (franchise: Franchise) => {
    navigate(`/franchise/${franchise.id}`);
  };

  const handleManage = (franchise: Franchise) => {
    navigate(`/franchise/manager/${franchise.id}`);
  };

  const handleApprove = async (id: string) => {
    try {
      await franchiseApi.actOnFranchise({ franchise_id: id, action: 'approve' });
      // Refresh franchises
      const response = await franchiseApi.getFranchiseList();
      setFranchises(response.items);
      toast({
        title: "Success",
        description: "Franchise has been approved and activated."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve franchise",
        variant: "destructive"
      });
    }
  };

  const handleSuspend = async (id: string) => {
    try {
      await franchiseApi.actOnFranchise({ franchise_id: id, action: 'suspend', reason: 'Suspended by admin' });
      // Refresh franchises
      const response = await franchiseApi.getFranchiseList();
      setFranchises(response.items);
      toast({
        title: "Success",
        description: "Franchise has been suspended."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to suspend franchise",
        variant: "destructive"
      });
    }
  };

  const handleTerminate = async (id: string) => {
    try {
      await franchiseApi.actOnFranchise({ franchise_id: id, action: 'terminate', reason: 'Terminated by admin' });
      // Refresh franchises
      const response = await franchiseApi.getFranchiseList();
      setFranchises(response.items);
      toast({
        title: "Success",
        description: "Franchise has been terminated."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to terminate franchise",
        variant: "destructive"
      });
    }
  };

  const handleReactivate = async (id: string) => {
    try {
      await franchiseApi.actOnFranchise({ franchise_id: id, action: 'reactivate' });
      // Refresh franchises
      const response = await franchiseApi.getFranchiseList();
      setFranchises(response.items);
      toast({
        title: "Success",
        description: "Franchise has been reactivated."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reactivate franchise",
        variant: "destructive"
      });
    }
  };

  const handleCreateFranchise = async (data: any) => {
    try {
      await franchiseApi.createFranchise(data);
      // Refresh franchises
      const response = await franchiseApi.getFranchiseList();
      setFranchises(response.items);
      setShowForm(false);
      setEditingFranchise(null);
      toast({
        title: "Success",
        description: "Franchise created successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create franchise",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (franchise: Franchise) => {
    // TODO: Implement franchise editing
    toast({
      title: "Feature not implemented",
      description: "Franchise editing is not yet available.",
      variant: "destructive"
    });
  };

  const filteredFranchises = franchises.filter(f => {
    if (filters.status !== 'all' && f.status !== filters.status) return false;
    if (filters.state !== 'all' && f.state !== filters.state) return false;
    if (filters.search) {
      const search = filters.search.toLowerCase();
      return (
        f.name.toLowerCase().includes(search) ||
        f.ownerName.toLowerCase().includes(search) ||
        f.email.toLowerCase().includes(search) ||
        f.city.toLowerCase().includes(search)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-background grid-lines">
      <TopControlBar />
      
      <main className="pt-14 transition-all duration-300 ml-4">
        <div className="p-6 space-y-6">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
          >
            <div>
              <h1 className="text-2xl font-mono font-bold text-foreground">
                Franchise Management
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Create, approve, suspend, or terminate franchise partners with territory mapping
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center glass-panel p-1 rounded-lg">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'list' 
                      ? 'bg-primary/20 text-primary' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'map' 
                      ? 'bg-primary/20 text-primary' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Map className="w-4 h-4" />
                </button>
              </div>

              <Button 
                variant="outline" 
                size="sm"
                className="command-button"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                className="command-button"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>

              <Button 
                variant="outline" 
                size="sm"
                className="command-button"
                onClick={() => {
                  toast({
                    title: "High traffic, please wait…",
                    description: "Refreshing franchise data."
                  });
                }}
              >
                <RefreshCcw className="w-4 h-4" />
              </Button>
              
              <Button 
                onClick={() => {
                  setEditingFranchise(null);
                  setShowForm(true);
                }}
                className="command-button-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Franchise
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <FranchiseStats franchises={franchises} />

          {/* Filters */}
          <FranchiseFilters 
            filters={filters} 
            onFiltersChange={setFilters}
            franchises={franchises}
          />

          {/* Content */}
          <AnimatePresence mode="wait">
            {viewMode === 'list' ? (
              <motion.div
                key="list"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <FranchiseTable
                  franchises={franchises}
                  onEdit={setSelectedFranchise}
                  onApprove={handleApprove}
                  onSuspend={handleSuspend}
                  onTerminate={handleTerminate}
                  onReactivate={handleReactivate}
                  onView={handleView}
                  onManage={handleManage}
                />
              </motion.div>
            ) : (
              <motion.div
                key="map"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <TerritoryMap
                  franchises={franchises}
                  onSelectFranchise={setSelectedFranchise}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <FranchiseForm
            franchise={editingFranchise}
            onSubmit={handleCreateFranchise}
            onClose={() => {
              setShowForm(false);
              setEditingFranchise(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default FranchiseManagement;
