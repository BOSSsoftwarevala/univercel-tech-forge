import { useState, useCallback } from 'react';
import { motion, Reorder, useDragControls } from 'framer-motion';
import { 
  GripVertical, Settings, Eye, Lock, Unlock, MoreVertical,
  Crown, Shield, Code2, Building2, Store, Zap, Star, Search,
  Target, ListTodo, Package, Brain, HeadphonesIcon, TrendingUp,
  Wallet, Megaphone, Scale, UserPlus, Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AppRole, ROLE_CONFIG } from '@/types/roles';

interface RoleTile {
  id: AppRole;
  visible: boolean;
  locked: boolean;
  order: number;
}

const roleIcons: Record<string, any> = {
  super_admin: Crown,
  admin: Shield,
  developer: Code2,
  franchise: Building2,
  reseller: Store,
  influencer: Zap,
  prime: Star,
  seo_manager: Search,
  lead_manager: Target,
  task_manager: ListTodo,
  demo_manager: Package,
  rnd_manager: Brain,
  client_success: HeadphonesIcon,
  performance_manager: TrendingUp,
  finance_manager: Wallet,
  marketing_manager: Megaphone,
  legal_compliance: Scale,
  hr_manager: UserPlus,
  support: HeadphonesIcon,
  ai_manager: Brain,
  client: Users,
};

interface DraggableRoleTilesProps {
  onTileClick?: (role: AppRole) => void;
  onOrderChange?: (tiles: RoleTile[]) => void;
}

export function DraggableRoleTiles({ onTileClick, onOrderChange }: DraggableRoleTilesProps) {
  const [tiles, setTiles] = useState<RoleTile[]>(
    Object.keys(ROLE_CONFIG).map((role, index) => ({
      id: role as AppRole,
      visible: true,
      locked: role === 'super_admin',
      order: index,
    }))
  );

  const handleReorder = useCallback((newOrder: RoleTile[]) => {
    setTiles(newOrder);
    onOrderChange?.(newOrder);
  }, [onOrderChange]);

  const toggleVisibility = (id: AppRole) => {
    setTiles(tiles.map(tile => 
      tile.id === id ? { ...tile, visible: !tile.visible } : tile
    ));
  };

  const toggleLock = (id: AppRole) => {
    if (id === 'super_admin') return; // Can't unlock super admin
    setTiles(tiles.map(tile => 
      tile.id === id ? { ...tile, locked: !tile.locked } : tile
    ));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-mono font-semibold text-foreground">Role Dashboard Tiles</h3>
          <p className="text-sm text-muted-foreground">Drag to reorder • Click to access</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="w-4 h-4" />
          Configure
        </Button>
      </div>

      <Reorder.Group 
        axis="y" 
        values={tiles} 
        onReorder={handleReorder}
        className="space-y-2"
      >
        {tiles.map((tile) => {
          const config = ROLE_CONFIG[tile.id];
          const Icon = roleIcons[tile.id] || Users;
          
          return (
            <Reorder.Item
              key={tile.id}
              value={tile}
              dragListener={!tile.locked}
              className={`${tile.locked ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}`}
            >
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: tile.visible ? 1 : 0.5, 
                  y: 0,
                  scale: tile.visible ? 1 : 0.98
                }}
                whileHover={{ scale: tile.locked ? 1 : 1.01 }}
                className={`
                  glass-panel p-4 flex items-center gap-4
                  ${!tile.visible && 'opacity-50 grayscale'}
                  ${tile.locked && 'border-primary/30'}
                `}
                onClick={() => tile.visible && onTileClick?.(tile.id)}
              >
                {/* Drag Handle */}
                <div className={`${tile.locked ? 'opacity-30' : 'opacity-70 hover:opacity-100'}`}>
                  <GripVertical className="w-5 h-5 text-muted-foreground" />
                </div>

                {/* Icon */}
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${config.color}20`, color: config.color }}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-foreground truncate">{config.label}</h4>
                    {tile.locked && (
                      <Lock className="w-3 h-3 text-primary" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {config.modules.slice(0, 3).join(' • ')}
                    {config.modules.length > 3 && ` +${config.modules.length - 3} more`}
                  </p>
                </div>

                {/* Tier Badge */}
                <Badge 
                  variant="outline" 
                  className="text-[10px] uppercase tracking-wider"
                  style={{ 
                    borderColor: `${config.color}50`,
                    color: config.color
                  }}
                >
                  {config.tier}
                </Badge>

                {/* Actions */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      toggleVisibility(tile.id);
                    }}>
                      <Eye className="w-4 h-4 mr-2" />
                      {tile.visible ? 'Hide' : 'Show'}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLock(tile.id);
                      }}
                      disabled={tile.id === 'super_admin'}
                    >
                      {tile.locked ? (
                        <>
                          <Unlock className="w-4 h-4 mr-2" />
                          Unlock
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          Lock Position
                        </>
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
            </Reorder.Item>
          );
        })}
      </Reorder.Group>
    </div>
  );
}

export default DraggableRoleTiles;
