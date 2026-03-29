import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Map, MapPin, AlertTriangle, CheckCircle, Building2, Users, Target } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface Territory {
  id: string;
  code: string;
  name: string;
  city: string;
  state: string;
  country: string;
  assignedFranchise: string | null;
  franchiseCode: string | null;
  population: string;
  businessDensity: string;
  status: 'available' | 'assigned' | 'overlap_risk';
  overlappingWith?: string[];
}

const mockTerritories: Territory[] = [
  {
    id: 'T-001',
    code: 'MUM-CENT',
    name: 'Mumbai Central',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    assignedFranchise: 'TechVentures Mumbai',
    franchiseCode: 'MUM-CENT-001',
    population: '2.5M',
    businessDensity: 'High',
    status: 'assigned'
  },
  {
    id: 'T-002',
    code: 'MUM-SOUTH',
    name: 'Mumbai South',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    assignedFranchise: null,
    franchiseCode: null,
    population: '1.8M',
    businessDensity: 'Very High',
    status: 'available'
  },
  {
    id: 'T-003',
    code: 'DEL-NOR',
    name: 'Delhi North',
    city: 'Delhi',
    state: 'Delhi',
    country: 'India',
    assignedFranchise: 'Digital Dynamics Delhi',
    franchiseCode: 'DEL-NOR-002',
    population: '3.2M',
    businessDensity: 'High',
    status: 'assigned'
  },
  {
    id: 'T-004',
    code: 'BLR-EAST',
    name: 'Bangalore East',
    city: 'Bangalore',
    state: 'Karnataka',
    country: 'India',
    assignedFranchise: 'SaaS Solutions Bangalore',
    franchiseCode: 'BLR-EAST-003',
    population: '2.1M',
    businessDensity: 'High',
    status: 'assigned'
  },
  {
    id: 'T-005',
    code: 'BLR-WEST',
    name: 'Bangalore West',
    city: 'Bangalore',
    state: 'Karnataka',
    country: 'India',
    assignedFranchise: null,
    franchiseCode: null,
    population: '1.9M',
    businessDensity: 'Medium',
    status: 'overlap_risk',
    overlappingWith: ['BLR-EAST']
  }
];

export function FMTerritoryMap() {
  const [territories] = useState<Territory[]>(mockTerritories);
  const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(null);
  const [showOverlapAlert, setShowOverlapAlert] = useState(false);

  const handleTerritoryClick = (territory: Territory) => {
    if (territory.status === 'overlap_risk') {
      setSelectedTerritory(territory);
      setShowOverlapAlert(true);
    } else {
      setSelectedTerritory(territory);
    }
  };

  const requestModification = () => {
    toast.info('Modification Request Sent', {
      description: 'Territory modification requires Admin approval'
    });
    setShowOverlapAlert(false);
  };

  const getStatusColor = (status: Territory['status']) => {
    switch (status) {
      case 'assigned':
        return 'bg-green-500/20 border-green-500/30';
      case 'available':
        return 'bg-blue-500/20 border-blue-500/30';
      case 'overlap_risk':
        return 'bg-yellow-500/20 border-yellow-500/30';
    }
  };

  const getStatusBadge = (status: Territory['status']) => {
    switch (status) {
      case 'assigned':
        return <Badge className="bg-green-500/20 text-green-400">Assigned</Badge>;
      case 'available':
        return <Badge className="bg-blue-500/20 text-blue-400">Available</Badge>;
      case 'overlap_risk':
        return <Badge className="bg-yellow-500/20 text-yellow-400">Overlap Risk</Badge>;
    }
  };

  const assignedCount = territories.filter(t => t.status === 'assigned').length;
  const availableCount = territories.filter(t => t.status === 'available').length;
  const overlapCount = territories.filter(t => t.status === 'overlap_risk').length;

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="border-b border-border/50">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Map className="h-5 w-5 text-primary" />
            Territory Map
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-500/10">
              {assignedCount} Assigned
            </Badge>
            <Badge variant="outline" className="bg-blue-500/10">
              {availableCount} Available
            </Badge>
            {overlapCount > 0 && (
              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400">
                {overlapCount} Overlap Risk
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {/* Map Visualization Placeholder */}
        <div className="relative h-48 mb-4 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 border border-border/50 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Map className="h-12 w-12 text-primary/40 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Interactive Territory Map</p>
              <p className="text-xs text-muted-foreground">One Territory = One Franchise</p>
            </div>
          </div>
          {/* Territory pins */}
          <motion.div
            className="absolute top-8 left-16 p-1.5 rounded-full bg-green-500/30"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <MapPin className="h-4 w-4 text-green-400" />
          </motion.div>
          <motion.div
            className="absolute top-16 right-24 p-1.5 rounded-full bg-green-500/30"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
          >
            <MapPin className="h-4 w-4 text-green-400" />
          </motion.div>
          <motion.div
            className="absolute bottom-12 left-32 p-1.5 rounded-full bg-blue-500/30"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2, delay: 1 }}
          >
            <MapPin className="h-4 w-4 text-blue-400" />
          </motion.div>
          <motion.div
            className="absolute bottom-8 right-16 p-1.5 rounded-full bg-yellow-500/30"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
          </motion.div>
        </div>

        {/* Territory List */}
        <ScrollArea className="h-[300px]">
          <div className="space-y-2">
            {territories.map((territory, index) => (
              <motion.div
                key={territory.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${getStatusColor(territory.status)}`}
                onClick={() => handleTerritoryClick(territory)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{territory.name}</span>
                      <Badge variant="outline" className="text-xs">{territory.code}</Badge>
                      {getStatusBadge(territory.status)}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span>{territory.city}, {territory.state}</span>
                      <span>Pop: {territory.population}</span>
                      <span>Density: {territory.businessDensity}</span>
                    </div>
                    {territory.assignedFranchise && (
                      <div className="flex items-center gap-1 text-xs text-green-400 mt-1">
                        <Building2 className="h-3 w-3" />
                        {territory.assignedFranchise}
                      </div>
                    )}
                    {territory.overlappingWith && (
                      <div className="flex items-center gap-1 text-xs text-yellow-400 mt-1">
                        <AlertTriangle className="h-3 w-3" />
                        Overlaps with: {territory.overlappingWith.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>

        {/* Overlap Alert Dialog */}
        <Dialog open={showOverlapAlert} onOpenChange={setShowOverlapAlert}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-yellow-500">
                <AlertTriangle className="h-5 w-5" />
                Territory Overlap Detected
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <p className="font-medium">{selectedTerritory?.name}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  This territory has potential overlap with: {selectedTerritory?.overlappingWith?.join(', ')}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                Territory modification after activation requires Admin approval.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowOverlapAlert(false)}>
                Close
              </Button>
              <Button onClick={requestModification}>
                Request Modification
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
