import { useState } from 'react';
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

export interface Franchise {
  id: string;
  name: string;
  ownerName: string;
  email: string;
  phone: string;
  status: 'active' | 'pending' | 'suspended' | 'terminated';
  territory: string;
  state: string;
  city: string;
  commission: number;
  totalSales: number;
  joinedDate: string;
  lastActive: string;
  leadRouting: boolean;
  pricingVariation: number;
}

const mockFranchises: Franchise[] = [
  {
    id: 'FR-001',
    name: 'Tech Solutions Mumbai',
    ownerName: 'Rajesh Sharma',
    email: 'rajesh@techsolutions.com',
    phone: '+91 98765 43210',
    status: 'active',
    territory: 'Maharashtra - West',
    state: 'Maharashtra',
    city: 'Mumbai',
    commission: 15,
    totalSales: 2450000,
    joinedDate: '2024-01-15',
    lastActive: '2025-06-18',
    leadRouting: true,
    pricingVariation: 5
  },
  {
    id: 'FR-002',
    name: 'Digital Hub Delhi',
    ownerName: 'Priya Kapoor',
    email: 'priya@digitalhub.com',
    phone: '+91 98765 43211',
    status: 'active',
    territory: 'Delhi NCR',
    state: 'Delhi',
    city: 'New Delhi',
    commission: 18,
    totalSales: 3200000,
    joinedDate: '2023-11-20',
    lastActive: '2025-06-18',
    leadRouting: true,
    pricingVariation: 0
  },
  {
    id: 'FR-003',
    name: 'Software Point Bangalore',
    ownerName: 'Arun Kumar',
    email: 'arun@softwarepoint.com',
    phone: '+91 98765 43212',
    status: 'pending',
    territory: 'Karnataka - South',
    state: 'Karnataka',
    city: 'Bangalore',
    commission: 12,
    totalSales: 0,
    joinedDate: '2025-06-10',
    lastActive: '2025-06-15',
    leadRouting: false,
    pricingVariation: 3
  },
  {
    id: 'FR-004',
    name: 'IT Masters Chennai',
    ownerName: 'Lakshmi Narayanan',
    email: 'lakshmi@itmasters.com',
    phone: '+91 98765 43213',
    status: 'suspended',
    territory: 'Tamil Nadu - East',
    state: 'Tamil Nadu',
    city: 'Chennai',
    commission: 14,
    totalSales: 890000,
    joinedDate: '2024-06-05',
    lastActive: '2025-05-20',
    leadRouting: false,
    pricingVariation: 2
  },
  {
    id: 'FR-005',
    name: 'Code Factory Hyderabad',
    ownerName: 'Venkat Reddy',
    email: 'venkat@codefactory.com',
    phone: '+91 98765 43214',
    status: 'active',
    territory: 'Telangana - Central',
    state: 'Telangana',
    city: 'Hyderabad',
    commission: 16,
    totalSales: 1750000,
    joinedDate: '2024-03-22',
    lastActive: '2025-06-17',
    leadRouting: true,
    pricingVariation: 4
  },
  {
    id: 'FR-006',
    name: 'Tech Nexus Pune',
    ownerName: 'Suresh Patil',
    email: 'suresh@technexus.com',
    phone: '+91 98765 43215',
    status: 'terminated',
    territory: 'Maharashtra - West',
    state: 'Maharashtra',
    city: 'Pune',
    commission: 10,
    totalSales: 320000,
    joinedDate: '2023-08-15',
    lastActive: '2024-12-01',
    leadRouting: false,
    pricingVariation: 0
  }
];

const FranchiseManagement = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('franchise');
  const [franchises, setFranchises] = useState<Franchise[]>(mockFranchises);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [showForm, setShowForm] = useState(false);
  const [editingFranchise, setEditingFranchise] = useState<Franchise | null>(null);
  const [filters, setFilters] = useState({
    status: 'all',
    state: 'all',
    search: ''
  });

  const handleItemClick = (id: string) => {
    setActiveItem(id);
    if (id === 'dashboard') {
      navigate('/');
    }
  };

  const handleCreate = (data: Partial<Franchise>) => {
    const newFranchise: Franchise = {
      id: `FR-${String(franchises.length + 1).padStart(3, '0')}`,
      name: data.name || '',
      ownerName: data.ownerName || '',
      email: data.email || '',
      phone: data.phone || '',
      status: 'pending',
      territory: data.territory || '',
      state: data.state || '',
      city: data.city || '',
      commission: data.commission || 10,
      totalSales: 0,
      joinedDate: new Date().toISOString().split('T')[0],
      lastActive: new Date().toISOString().split('T')[0],
      leadRouting: data.leadRouting || false,
      pricingVariation: data.pricingVariation || 0
    };
    setFranchises([...franchises, newFranchise]);
    setShowForm(false);
    toast({
      title: "Operation executed successfully",
      description: `Franchise "${newFranchise.name}" has been created and is pending approval.`
    });
  };

  const handleUpdate = (data: Partial<Franchise>) => {
    if (!editingFranchise) return;
    setFranchises(franchises.map(f => 
      f.id === editingFranchise.id ? { ...f, ...data } : f
    ));
    setEditingFranchise(null);
    setShowForm(false);
    toast({
      title: "Operation executed successfully",
      description: `Franchise "${data.name}" has been updated.`
    });
  };

  const handleApprove = (id: string) => {
    setFranchises(franchises.map(f => 
      f.id === id ? { ...f, status: 'active' as const } : f
    ));
    toast({
      title: "Operation executed successfully",
      description: "Franchise has been approved and activated."
    });
  };

  const handleSuspend = (id: string) => {
    setFranchises(franchises.map(f => 
      f.id === id ? { ...f, status: 'suspended' as const, leadRouting: false } : f
    ));
    toast({
      title: "Operation executed successfully",
      description: "Franchise has been suspended. Lead routing disabled."
    });
  };

  const handleTerminate = (id: string) => {
    setFranchises(franchises.map(f => 
      f.id === id ? { ...f, status: 'terminated' as const, leadRouting: false } : f
    ));
    toast({
      title: "Operation executed successfully",
      description: "Franchise has been terminated."
    });
  };

  const handleReactivate = (id: string) => {
    setFranchises(franchises.map(f => 
      f.id === id ? { ...f, status: 'active' as const } : f
    ));
    toast({
      title: "Operation executed successfully",
      description: "Franchise has been reactivated."
    });
  };

  const handleEdit = (franchise: Franchise) => {
    setEditingFranchise(franchise);
    setShowForm(true);
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
                  franchises={filteredFranchises}
                  onEdit={handleEdit}
                  onApprove={handleApprove}
                  onSuspend={handleSuspend}
                  onTerminate={handleTerminate}
                  onReactivate={handleReactivate}
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
                  franchises={filteredFranchises}
                  onSelectFranchise={handleEdit}
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
            onSubmit={editingFranchise ? handleUpdate : handleCreate}
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
