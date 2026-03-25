/**
 * Category Hierarchy Navigator
 * Reusable component for Sub → Micro → Nano category navigation
 * Works across all manager modules
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  ChevronRight, ChevronDown, Layers, Grid3X3, 
  Zap, Tag, Folder, FolderOpen 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface NanoCategory {
  id: string;
  name: string;
  count?: number;
  status?: 'active' | 'inactive' | 'pending';
  onClick?: () => void;
}

export interface MicroCategory {
  id: string;
  name: string;
  nanos: NanoCategory[];
  icon?: React.ReactNode;
}

export interface SubCategory {
  id: string;
  name: string;
  micros: MicroCategory[];
  icon?: React.ReactNode;
  color?: string;
}

interface CategoryHierarchyNavigatorProps {
  title: string;
  categories: SubCategory[];
  onNanoClick?: (nano: NanoCategory, micro: MicroCategory, sub: SubCategory) => void;
  onMicroClick?: (micro: MicroCategory, sub: SubCategory) => void;
  onSubClick?: (sub: SubCategory) => void;
  className?: string;
  defaultExpandedSubs?: string[];
  defaultExpandedMicros?: string[];
  showCounts?: boolean;
  accentColor?: string;
}

export function CategoryHierarchyNavigator({
  title,
  categories,
  onNanoClick,
  onMicroClick,
  onSubClick,
  className,
  defaultExpandedSubs = [],
  defaultExpandedMicros = [],
  showCounts = true,
  accentColor = 'violet'
}: CategoryHierarchyNavigatorProps) {
  const [expandedSubs, setExpandedSubs] = useState<string[]>(defaultExpandedSubs);
  const [expandedMicros, setExpandedMicros] = useState<string[]>(defaultExpandedMicros);

  const toggleSub = useCallback((subId: string) => {
    setExpandedSubs(prev => 
      prev.includes(subId) ? prev.filter(s => s !== subId) : [...prev, subId]
    );
  }, []);

  const toggleMicro = useCallback((microKey: string) => {
    setExpandedMicros(prev => 
      prev.includes(microKey) ? prev.filter(m => m !== microKey) : [...prev, microKey]
    );
  }, []);

  const handleSubClick = useCallback((sub: SubCategory) => {
    toggleSub(sub.id);
    onSubClick?.(sub);
  }, [toggleSub, onSubClick]);

  const handleMicroClick = useCallback((micro: MicroCategory, sub: SubCategory) => {
    toggleMicro(`${sub.id}-${micro.id}`);
    onMicroClick?.(micro, sub);
  }, [toggleMicro, onMicroClick]);

  const handleNanoClick = useCallback((nano: NanoCategory, micro: MicroCategory, sub: SubCategory) => {
    nano.onClick?.();
    onNanoClick?.(nano, micro, sub);
  }, [onNanoClick]);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
      case 'inactive': return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/50';
      case 'pending': return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className={cn("bg-card/50 backdrop-blur border-border/50", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Layers className={cn("w-5 h-5", `text-${accentColor}-400`)} />
          {title}
          <Badge variant="outline" className="ml-2 text-xs">Sub → Micro → Nano</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="max-h-[500px]">
          <div className="space-y-3">
            {categories.map((sub) => (
              <div key={sub.id} className="border border-border/50 rounded-lg overflow-hidden">
                {/* SubCategory Level */}
                <motion.button
                  onClick={() => handleSubClick(sub)}
                  className={cn(
                    "w-full flex items-center justify-between p-3 transition-colors",
                    `bg-${accentColor}-500/10 hover:bg-${accentColor}-500/15`
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center",
                      `bg-${accentColor}-500/20`
                    )}>
                      {expandedSubs.includes(sub.id) ? (
                        <FolderOpen className={cn("w-4 h-4", `text-${accentColor}-400`)} />
                      ) : (
                        <Folder className={cn("w-4 h-4", `text-${accentColor}-400`)} />
                      )}
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-foreground">{sub.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {sub.micros.length} micro categories
                      </p>
                    </div>
                  </div>
                  <ChevronDown className={cn(
                    "w-5 h-5 text-muted-foreground transition-transform",
                    expandedSubs.includes(sub.id) && "rotate-180"
                  )} />
                </motion.button>

                {/* MicroCategory Level */}
                <AnimatePresence>
                  {expandedSubs.includes(sub.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-2 space-y-2 bg-background/30">
                        {sub.micros.map((micro) => (
                          <div key={micro.id} className="border border-border/30 rounded-lg overflow-hidden">
                            <motion.button
                              onClick={() => handleMicroClick(micro, sub)}
                              className="w-full flex items-center justify-between p-2 bg-purple-500/5 hover:bg-purple-500/10 transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded bg-purple-500/20 flex items-center justify-center">
                                  {micro.icon || <Grid3X3 className="w-3 h-3 text-purple-400" />}
                                </div>
                                <span className="text-sm font-medium">{micro.name}</span>
                                {showCounts && (
                                  <Badge variant="outline" className="text-xs">
                                    {micro.nanos.length} nanos
                                  </Badge>
                                )}
                              </div>
                              <ChevronDown className={cn(
                                "w-4 h-4 text-muted-foreground transition-transform",
                                expandedMicros.includes(`${sub.id}-${micro.id}`) && "rotate-180"
                              )} />
                            </motion.button>

                            {/* NanoCategory Level */}
                            <AnimatePresence>
                              {expandedMicros.includes(`${sub.id}-${micro.id}`) && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden"
                                >
                                  <div className="p-2 space-y-1 bg-background/50">
                                    {micro.nanos.map((nano) => (
                                      <motion.div
                                        key={nano.id}
                                        whileHover={{ x: 4 }}
                                        onClick={() => handleNanoClick(nano, micro, sub)}
                                        className="flex items-center justify-between p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group"
                                      >
                                        <div className="flex items-center gap-2">
                                          <div className="w-1.5 h-1.5 rounded-full bg-teal-400 group-hover:bg-teal-300" />
                                          <Zap className="w-3 h-3 text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                          <span className="text-xs text-muted-foreground group-hover:text-teal-400 transition-colors">
                                            {nano.name}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          {showCounts && nano.count !== undefined && (
                                            <Badge variant="secondary" className="text-xs h-5">
                                              {nano.count}
                                            </Badge>
                                          )}
                                          {nano.status && (
                                            <Badge className={cn("text-xs h-5", getStatusColor(nano.status))}>
                                              {nano.status}
                                            </Badge>
                                          )}
                                          <ChevronRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                      </motion.div>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

// Breadcrumb component for hierarchy navigation
export function CategoryBreadcrumb({
  path,
  onNavigate,
  className
}: {
  path: { id: string; name: string; level: 'sub' | 'micro' | 'nano' }[];
  onNavigate: (index: number) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-1 text-sm", className)}>
      {path.map((item, index) => (
        <div key={item.id} className="flex items-center gap-1">
          {index > 0 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate(index)}
            className={cn(
              "h-6 px-2 text-xs",
              index === path.length - 1 
                ? "text-foreground font-medium" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {item.name}
          </Button>
        </div>
      ))}
    </div>
  );
}
