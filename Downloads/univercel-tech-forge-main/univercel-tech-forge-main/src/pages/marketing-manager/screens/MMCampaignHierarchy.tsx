import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { useSystemActions } from '@/hooks/useSystemActions';
import {
  ChevronRight, ChevronDown, Plus, Edit2, Trash2, Eye, 
  Megaphone, Layers, Image, MousePointerClick, Target,
  TrendingUp, Pause, Play, MoreHorizontal
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Sub → Micro → Nano Category Structure
// Campaign → Channel → Ad Set → Ad → Creative → CTA → Conversion Event

interface HierarchyItem {
  id: string;
  name: string;
  type: 'campaign' | 'channel' | 'adset' | 'ad' | 'creative' | 'cta' | 'conversion';
  status: 'active' | 'paused' | 'draft';
  metrics?: { impressions: number; clicks: number; conversions: number; spend: number };
  children?: HierarchyItem[];
  expanded?: boolean;
}

const typeConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  campaign: { icon: Megaphone, color: 'text-emerald-400', label: 'Campaign' },
  channel: { icon: Layers, color: 'text-blue-400', label: 'Channel' },
  adset: { icon: Target, color: 'text-purple-400', label: 'Ad Set' },
  ad: { icon: Image, color: 'text-orange-400', label: 'Ad' },
  creative: { icon: Image, color: 'text-pink-400', label: 'Creative' },
  cta: { icon: MousePointerClick, color: 'text-cyan-400', label: 'CTA' },
  conversion: { icon: TrendingUp, color: 'text-green-400', label: 'Conversion Event' },
};

const mockHierarchy: HierarchyItem[] = [
  {
    id: 'cmp1',
    name: 'Summer Sale 2025',
    type: 'campaign',
    status: 'active',
    metrics: { impressions: 500000, clicks: 25000, conversions: 1200, spend: 4500 },
    expanded: true,
    children: [
      {
        id: 'ch1',
        name: 'Facebook',
        type: 'channel',
        status: 'active',
        metrics: { impressions: 300000, clicks: 15000, conversions: 700, spend: 2700 },
        expanded: true,
        children: [
          {
            id: 'as1',
            name: 'Lookalike Audience',
            type: 'adset',
            status: 'active',
            metrics: { impressions: 150000, clicks: 7500, conversions: 350, spend: 1350 },
            expanded: true,
            children: [
              {
                id: 'ad1',
                name: 'Video Ad - 30s',
                type: 'ad',
                status: 'active',
                metrics: { impressions: 75000, clicks: 3750, conversions: 175, spend: 675 },
                children: [
                  {
                    id: 'cr1',
                    name: 'Summer Vibes Creative',
                    type: 'creative',
                    status: 'active',
                    children: [
                      {
                        id: 'cta1',
                        name: 'Shop Now',
                        type: 'cta',
                        status: 'active',
                        children: [
                          {
                            id: 'conv1',
                            name: 'Purchase Complete',
                            type: 'conversion',
                            status: 'active',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                id: 'ad2',
                name: 'Carousel Ad',
                type: 'ad',
                status: 'paused',
                metrics: { impressions: 75000, clicks: 3750, conversions: 175, spend: 675 },
              },
            ],
          },
          {
            id: 'as2',
            name: 'Interest-Based',
            type: 'adset',
            status: 'active',
            metrics: { impressions: 150000, clicks: 7500, conversions: 350, spend: 1350 },
          },
        ],
      },
      {
        id: 'ch2',
        name: 'Google Ads',
        type: 'channel',
        status: 'active',
        metrics: { impressions: 200000, clicks: 10000, conversions: 500, spend: 1800 },
      },
    ],
  },
  {
    id: 'cmp2',
    name: 'Brand Awareness Q3',
    type: 'campaign',
    status: 'draft',
    metrics: { impressions: 0, clicks: 0, conversions: 0, spend: 0 },
  },
];

const MMCampaignHierarchy: React.FC = () => {
  const { executeAction, actions } = useSystemActions();
  const [hierarchy, setHierarchy] = useState<HierarchyItem[]>(mockHierarchy);
  const [selectedItem, setSelectedItem] = useState<HierarchyItem | null>(null);

  const toggleExpand = (id: string) => {
    const updateExpanded = (items: HierarchyItem[]): HierarchyItem[] => {
      return items.map(item => {
        if (item.id === id) {
          return { ...item, expanded: !item.expanded };
        }
        if (item.children) {
          return { ...item, children: updateExpanded(item.children) };
        }
        return item;
      });
    };
    setHierarchy(updateExpanded(hierarchy));
  };

  const handleStatusToggle = useCallback(async (id: string, name: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    await executeAction({
      module: "marketing",
      action: newStatus === 'active' ? 'resume' : 'pause',
      entityType: "campaign_item",
      entityId: id,
      entityName: name,
    });
    toast.success(`Status changed to ${newStatus}`);
  }, [executeAction]);

  const handleCreate = useCallback(async (parentId: string, type: string) => {
    await executeAction({
      module: "marketing",
      action: "create",
      entityType: type,
      entityId: parentId,
    });
    toast.info(`Creating new ${type}...`);
  }, [executeAction]);

  const handleEdit = useCallback(async (item: HierarchyItem) => {
    setSelectedItem(item);
    await executeAction({
      module: "marketing",
      action: "update",
      entityType: item.type,
      entityId: item.id,
      entityName: item.name,
    });
    toast.info(`Editing ${item.name}`);
  }, [executeAction]);

  const handleDelete = useCallback(async (id: string, name: string) => {
    await actions.softDelete("marketing", "campaign_item", id, name);
    toast.success('Item deleted (soft delete)');
  }, [actions]);

  const renderItem = (item: HierarchyItem, depth: number = 0) => {
    const config = typeConfig[item.type];
    const Icon = config.icon;
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id}>
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className={`flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800/50 cursor-pointer group`}
          style={{ paddingLeft: `${depth * 24 + 8}px` }}
          onClick={() => setSelectedItem(item)}
        >
          {/* Expand/Collapse */}
          {hasChildren ? (
            <button
              onClick={(e) => { e.stopPropagation(); toggleExpand(item.id); }}
              className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-white"
            >
              {item.expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          ) : (
            <div className="w-5" />
          )}

          {/* Icon */}
          <Icon className={`w-4 h-4 ${config.color}`} />

          {/* Name */}
          <span className="text-sm text-white flex-1 truncate">{item.name}</span>

          {/* Status */}
          <Badge 
            variant="outline" 
            className={`text-[10px] ${
              item.status === 'active' ? 'text-green-400 border-green-500/30' :
              item.status === 'paused' ? 'text-yellow-400 border-yellow-500/30' :
              'text-slate-400 border-slate-500/30'
            }`}
          >
            {item.status}
          </Badge>

          {/* Metrics (if available) */}
          {item.metrics && (
            <div className="hidden md:flex items-center gap-4 text-xs text-slate-400">
              <span>{(item.metrics.impressions / 1000).toFixed(0)}K imp</span>
              <span>{item.metrics.clicks.toLocaleString()} clicks</span>
              <span className="text-emerald-400">{item.metrics.conversions} conv</span>
            </div>
          )}

          {/* Actions */}
          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); handleStatusToggle(item.id, item.name, item.status); }}>
              {item.status === 'active' ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={e => e.stopPropagation()}>
                  <MoreHorizontal className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleEdit(item)}>
                  <Edit2 className="w-3 h-3 mr-2" /> Edit
                </DropdownMenuItem>
                {item.type !== 'conversion' && (
                  <DropdownMenuItem onClick={() => handleCreate(item.id, getChildType(item.type))}>
                    <Plus className="w-3 h-3 mr-2" /> Add {typeConfig[getChildType(item.type)]?.label}
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => handleDelete(item.id, item.name)} className="text-red-400">
                  <Trash2 className="w-3 h-3 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.div>

        {/* Children */}
        <AnimatePresence>
          {item.expanded && item.children && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              {item.children.map(child => renderItem(child, depth + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const getChildType = (type: string): string => {
    const map: Record<string, string> = {
      campaign: 'channel',
      channel: 'adset',
      adset: 'ad',
      ad: 'creative',
      creative: 'cta',
      cta: 'conversion',
    };
    return map[type] || 'conversion';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-emerald-400" />
            Campaign Hierarchy
          </h2>
          <p className="text-slate-400 text-sm">Campaign → Channel → Ad Set → Ad → Creative → CTA → Conversion</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      {/* Hierarchy Legend */}
      <div className="flex items-center gap-4 flex-wrap">
        {Object.entries(typeConfig).map(([key, config]) => {
          const Icon = config.icon;
          return (
            <div key={key} className="flex items-center gap-1 text-xs text-slate-400">
              <Icon className={`w-3 h-3 ${config.color}`} />
              <span>{config.label}</span>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Hierarchy Tree */}
        <Card className="col-span-2 bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white">Campaign Structure</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px]">
              {hierarchy.map(item => renderItem(item))}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Detail Panel */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white">
              {selectedItem ? `${typeConfig[selectedItem.type]?.label} Details` : 'Select an Item'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedItem ? (
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-400 mb-1">Name</p>
                  <p className="text-white font-medium">{selectedItem.name}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Type</p>
                  <Badge className={typeConfig[selectedItem.type]?.color}>
                    {typeConfig[selectedItem.type]?.label}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Status</p>
                  <Badge variant="outline">{selectedItem.status}</Badge>
                </div>
                {selectedItem.metrics && (
                  <>
                    <div className="pt-4 border-t border-slate-700">
                      <p className="text-xs text-slate-400 mb-3">Performance</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center p-2 bg-slate-900/50 rounded">
                          <p className="text-lg font-bold text-white">{(selectedItem.metrics.impressions / 1000).toFixed(0)}K</p>
                          <p className="text-[10px] text-slate-500">Impressions</p>
                        </div>
                        <div className="text-center p-2 bg-slate-900/50 rounded">
                          <p className="text-lg font-bold text-white">{selectedItem.metrics.clicks.toLocaleString()}</p>
                          <p className="text-[10px] text-slate-500">Clicks</p>
                        </div>
                        <div className="text-center p-2 bg-slate-900/50 rounded">
                          <p className="text-lg font-bold text-emerald-400">{selectedItem.metrics.conversions}</p>
                          <p className="text-[10px] text-slate-500">Conversions</p>
                        </div>
                        <div className="text-center p-2 bg-slate-900/50 rounded">
                          <p className="text-lg font-bold text-orange-400">${selectedItem.metrics.spend}</p>
                          <p className="text-[10px] text-slate-500">Spend</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                <div className="pt-4 flex gap-2">
                  <Button size="sm" className="flex-1">
                    <Edit2 className="w-3 h-3 mr-1" /> Edit
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="w-3 h-3 mr-1" /> Analytics
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <Layers className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Click on any item to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MMCampaignHierarchy;
