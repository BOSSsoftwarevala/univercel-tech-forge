import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  History,
  GitCompare,
  RotateCcw,
  Eye,
  ChevronRight,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { format } from 'date-fns';

interface VersionEntry {
  id: string;
  product_id: string;
  product_name: string;
  action: string;
  action_details: any;
  performed_by: string | null;
  created_at: string;
}

interface PMProductVersionHistoryProps {
  productId: string;
  productName: string;
  onRestore: () => void;
}

const PMProductVersionHistory: React.FC<PMProductVersionHistoryProps> = ({ 
  productId, 
  productName,
  onRestore 
}) => {
  const [versions, setVersions] = useState<VersionEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [restoring, setRestoring] = useState(false);

  useEffect(() => {
    fetchVersionHistory();
  }, [productId]);

  const fetchVersionHistory = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('product_action_logs')
      .select('*')
      .eq('product_id', productId)
      .in('action', ['product_created', 'product_updated', 'product_restored'])
      .order('created_at', { ascending: false });

    if (data) setVersions(data);
    setLoading(false);
  };

  const handleRestore = async (version: VersionEntry) => {
    if (!version.action_details) {
      toast.error('No restorable data found');
      return;
    }

    setRestoring(true);
    try {
      const restoreData = version.action_details;
      
      const { error } = await supabase
        .from('products')
        .update({
          product_name: restoreData.product_name,
          product_type: restoreData.product_type,
          description: restoreData.description,
          pricing_model: restoreData.pricing_model,
          lifetime_price: restoreData.lifetime_price,
          monthly_price: restoreData.monthly_price,
          status: restoreData.status,
          features_json: restoreData.features_json,
        })
        .eq('product_id', productId);

      if (error) throw error;

      // Log restore action
      await supabase.from('product_action_logs').insert([{
        product_id: productId,
        product_name: restoreData.product_name,
        action: 'product_restored',
        action_details: { 
          restored_from_version: version.id,
          restored_at: new Date().toISOString(),
          previous_data: restoreData,
        },
      }]);

      toast.success('Product restored to selected version');
      onRestore();
      fetchVersionHistory();
    } catch (error: any) {
      toast.error('Failed to restore: ' + error.message);
    } finally {
      setRestoring(false);
    }
  };

  const toggleVersionSelection = (id: string) => {
    if (selectedVersions.includes(id)) {
      setSelectedVersions(selectedVersions.filter(v => v !== id));
    } else if (selectedVersions.length < 2) {
      setSelectedVersions([...selectedVersions, id]);
    }
  };

  const getVersionsToCompare = () => {
    const v1 = versions.find(v => v.id === selectedVersions[0]);
    const v2 = versions.find(v => v.id === selectedVersions[1]);
    return [v1, v2];
  };

  const renderDiff = (oldVal: any, newVal: any, key: string) => {
    if (JSON.stringify(oldVal) === JSON.stringify(newVal)) {
      return <span className="text-muted-foreground">{String(newVal || '-')}</span>;
    }
    return (
      <div className="flex items-center gap-2">
        <span className="line-through text-red-500">{String(oldVal || '-')}</span>
        <ArrowRight className="w-3 h-3" />
        <span className="text-green-500">{String(newVal || '-')}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm">
            <History className="w-4 h-4" />
            Version History - {productName}
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            disabled={selectedVersions.length !== 2}
            onClick={() => setCompareOpen(true)}
          >
            <GitCompare className="w-4 h-4 mr-2" />
            Compare ({selectedVersions.length}/2)
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-2">
            {versions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No version history available
              </p>
            ) : (
              versions.map((version, index) => (
                <div 
                  key={version.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedVersions.includes(version.id) 
                      ? 'border-primary bg-primary/5' 
                      : 'hover:bg-secondary/50'
                  }`}
                  onClick={() => toggleVersionSelection(version.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                        v{versions.length - index}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">
                            {version.action.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                          {index === 0 && (
                            <Badge variant="secondary" className="text-xs">Current</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(version.created_at), 'PPpp')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                            <Eye className="w-3 h-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Version Details</DialogTitle>
                          </DialogHeader>
                          <ScrollArea className="h-96">
                            <pre className="text-xs bg-secondary p-4 rounded overflow-auto">
                              {JSON.stringify(version.action_details, null, 2)}
                            </pre>
                          </ScrollArea>
                        </DialogContent>
                      </Dialog>
                      {index !== 0 && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          disabled={restoring}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRestore(version);
                          }}
                        >
                          <RotateCcw className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Compare Dialog */}
        <Dialog open={compareOpen} onOpenChange={setCompareOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Compare Versions</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              {getVersionsToCompare().map((version, idx) => version && (
                <Card key={idx}>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm">
                      Version {versions.length - versions.indexOf(version)}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(version.created_at), 'PPpp')}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-64">
                      <div className="space-y-2 text-sm">
                        {version.action_details && Object.entries(version.action_details).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-muted-foreground capitalize">
                              {key.replace(/_/g, ' ')}:
                            </span>
                            <span className="font-medium truncate max-w-[200px]">
                              {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default PMProductVersionHistory;
