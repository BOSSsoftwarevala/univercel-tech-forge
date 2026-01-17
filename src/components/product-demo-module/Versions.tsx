/**
 * VERSIONS MANAGEMENT
 * Version history, changelog, rollback
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  GitBranch, Clock, RotateCcw, Rocket, Lock, 
  ChevronRight, FileText 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

interface Version {
  id: string;
  version: string;
  product: string;
  releaseDate: string;
  status: 'live' | 'archived' | 'frozen';
  changes: string[];
}

const versions: Version[] = [
  { 
    id: '1', 
    version: 'v3.2.1', 
    product: 'School ERP Pro', 
    releaseDate: '2024-01-15',
    status: 'live',
    changes: ['Fixed attendance bug', 'Added new reports', 'Performance improvements']
  },
  { 
    id: '2', 
    version: 'v3.2.0', 
    product: 'School ERP Pro', 
    releaseDate: '2024-01-10',
    status: 'archived',
    changes: ['Major UI overhaul', 'New dashboard widgets', 'Multi-language support']
  },
  { 
    id: '3', 
    version: 'v2.5.0', 
    product: 'Hospital Management', 
    releaseDate: '2024-01-12',
    status: 'live',
    changes: ['Patient queue system', 'Prescription module', 'Lab integration']
  },
  { 
    id: '4', 
    version: 'v2.4.5', 
    product: 'Hospital Management', 
    releaseDate: '2024-01-05',
    status: 'frozen',
    changes: ['Security patches', 'Bug fixes']
  },
  { 
    id: '5', 
    version: 'v1.8.0', 
    product: 'Restaurant POS', 
    releaseDate: '2024-01-08',
    status: 'live',
    changes: ['Table management', 'Kitchen display', 'Split billing']
  },
];

const statusConfig = {
  live: { color: 'emerald', label: 'Live' },
  archived: { color: 'gray', label: 'Archived' },
  frozen: { color: 'blue', label: 'Frozen' },
};

export const Versions: React.FC = () => {
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);

  const handleRelease = (version: string) => {
    toast.success(`Released ${version} to production`);
  };

  const handleRollback = (version: string) => {
    toast.warning(`Rolling back to ${version}...`);
  };

  const handleFreeze = (version: string) => {
    toast.info(`Frozen ${version} - no changes allowed`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-violet-400" />
          Version Management
        </h1>
        <p className="text-sm text-muted-foreground">
          Version history, changelog & rollback controls
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Version List */}
        <div className="lg:col-span-2">
          <Card className="bg-card/80 border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Version History</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                <div className="space-y-2 p-4 pt-0">
                  {versions.map((version, idx) => {
                    const config = statusConfig[version.status];
                    
                    return (
                      <motion.div
                        key={version.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => setSelectedVersion(version)}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          selectedVersion?.id === version.id 
                            ? 'border-violet-500/50 bg-violet-500/10' 
                            : 'border-border/50 hover:border-border bg-muted/30'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                              <GitBranch className="w-5 h-5 text-violet-400" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-foreground">{version.version}</span>
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs bg-${config.color}-500/20 text-${config.color}-400 border-${config.color}-500/30`}
                                >
                                  {config.label}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{version.product}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {version.releaseDate}
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Version Detail */}
        <div>
          <Card className="bg-card/80 border-border/50 sticky top-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4" />
                {selectedVersion ? 'Version Details' : 'Select a Version'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedVersion ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-2xl font-bold text-foreground">{selectedVersion.version}</p>
                    <p className="text-sm text-muted-foreground">{selectedVersion.product}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Changelog</p>
                    <ul className="space-y-1">
                      {selectedVersion.changes.map((change, idx) => (
                        <li key={idx} className="text-sm text-foreground flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
                          {change}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-border/50 space-y-2">
                    <Button 
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => handleRelease(selectedVersion.version)}
                      disabled={selectedVersion.status === 'live'}
                    >
                      <Rocket className="w-4 h-4 mr-2" />
                      Release
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleRollback(selectedVersion.version)}
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Rollback
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleFreeze(selectedVersion.version)}
                      disabled={selectedVersion.status === 'frozen'}
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Freeze
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <GitBranch className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Select a version to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
