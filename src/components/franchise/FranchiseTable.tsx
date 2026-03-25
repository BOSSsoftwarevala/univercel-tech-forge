import { motion } from 'framer-motion';
import { 
  MoreHorizontal, 
  CheckCircle, 
  XCircle, 
  Ban, 
  Edit, 
  Eye,
  RefreshCcw,
  MapPin,
  Phone,
  Mail,
  Calendar
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Franchise } from '@/pages/FranchiseManagement';

interface FranchiseTableProps {
  franchises: Franchise[];
  onEdit: (franchise: Franchise) => void;
  onApprove: (id: string) => void;
  onSuspend: (id: string) => void;
  onTerminate: (id: string) => void;
  onReactivate: (id: string) => void;
  onView: (franchise: Franchise) => void;
  onManage: (franchise: Franchise) => void;
}

const statusConfig = {
  active: { 
    label: 'Active', 
    className: 'bg-neon-green/20 text-neon-green border-neon-green/30' 
  },
  pending: { 
    label: 'Pending', 
    className: 'bg-neon-orange/20 text-neon-orange border-neon-orange/30' 
  },
  suspended: { 
    label: 'Suspended', 
    className: 'bg-neon-red/20 text-neon-red border-neon-red/30' 
  },
  terminated: { 
    label: 'Terminated', 
    className: 'bg-muted text-muted-foreground border-border' 
  }
};

const FranchiseTable = ({ 
  franchises, 
  onEdit, 
  onApprove, 
  onSuspend, 
  onTerminate,
  onReactivate,
  onView,
  onManage
}: FranchiseTableProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-panel overflow-hidden"
    >
      <Table>
        <TableHeader>
          <TableRow className="border-border/30 hover:bg-transparent">
            <TableHead className="text-muted-foreground font-mono text-xs">ID</TableHead>
            <TableHead className="text-muted-foreground font-mono text-xs">FRANCHISE</TableHead>
            <TableHead className="text-muted-foreground font-mono text-xs">TERRITORY</TableHead>
            <TableHead className="text-muted-foreground font-mono text-xs">STATUS</TableHead>
            <TableHead className="text-muted-foreground font-mono text-xs">COMMISSION</TableHead>
            <TableHead className="text-muted-foreground font-mono text-xs">TOTAL SALES</TableHead>
            <TableHead className="text-muted-foreground font-mono text-xs">LEAD ROUTING</TableHead>
            <TableHead className="text-muted-foreground font-mono text-xs text-right">ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {franchises.map((franchise, index) => (
            <motion.tr
              key={franchise.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="border-border/20 hover:bg-secondary/30 transition-colors group"
            >
              <TableCell className="font-mono text-sm text-primary">
                {franchise.id}
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <p className="font-medium text-foreground">{franchise.franchise_name}</p>
                  <p className="text-xs text-muted-foreground">Staff: {franchise.staff_count}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <p className="text-sm text-foreground">{franchise.deep_analytics?.city || 'N/A'}</p>
                  <p className="text-xs text-muted-foreground">
                    {franchise.deep_analytics?.state || ''}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={statusConfig[franchise.status]?.className || statusConfig.active.className}
                >
                  {statusConfig[franchise.status]?.label || franchise.status}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="font-mono text-neon-teal">{franchise.leads}</span>
              </TableCell>
              <TableCell>
                <span className="font-mono text-foreground">
                  ₹{(franchise.revenue / 100000).toFixed(2)}L
                </span>
              </TableCell>
              <TableCell>
                <Badge 
                  variant="outline"
                  className={franchise.leadRouting 
                    ? 'bg-neon-green/10 text-neon-green border-neon-green/30' 
                    : 'bg-muted text-muted-foreground border-border'
                  }
                >
                  {franchise.leadRouting ? 'Enabled' : 'Disabled'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel className="font-mono text-xs">
                      Actions
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem onClick={() => onView(franchise)}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => onManage(franchise)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Manage Franchise
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {franchise.status === 'pending' && (
                      <DropdownMenuItem 
                        onClick={() => onApprove(franchise.id)}
                        className="text-neon-green focus:text-neon-green"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </DropdownMenuItem>
                    )}

                    {(franchise.status === 'suspended' || franchise.status === 'terminated') && (
                      <DropdownMenuItem 
                        onClick={() => onReactivate(franchise.id)}
                        className="text-neon-green focus:text-neon-green"
                      >
                        <RefreshCcw className="w-4 h-4 mr-2" />
                        Reactivate
                      </DropdownMenuItem>
                    )}

                    {franchise.status === 'active' && (
                      <DropdownMenuItem 
                        onClick={() => onSuspend(franchise.id)}
                        className="text-neon-orange focus:text-neon-orange"
                      >
                        <Ban className="w-4 h-4 mr-2" />
                        Suspend
                      </DropdownMenuItem>
                    )}

                    {franchise.status !== 'terminated' && (
                      <DropdownMenuItem 
                        onClick={() => onTerminate(franchise.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Terminate
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>

      {franchises.length === 0 && (
        <div className="p-12 text-center">
          <p className="text-muted-foreground">No franchises found matching your criteria.</p>
        </div>
      )}
    </motion.div>
  );
};

export default FranchiseTable;
