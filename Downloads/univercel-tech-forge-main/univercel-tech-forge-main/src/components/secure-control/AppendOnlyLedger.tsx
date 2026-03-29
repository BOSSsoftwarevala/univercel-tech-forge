import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { FileText, Lock, Search, Hash, Clock, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

interface LedgerEntry {
  id: string;
  timestamp: string;
  valaId: string;
  action: string;
  actionHash: string;
  status: 'recorded' | 'verified' | 'flagged';
  blockNumber: number;
}

interface AppendOnlyLedgerProps {
  entries: LedgerEntry[];
  currentValaId: string;
  roleLevel: string;
}

export function AppendOnlyLedger({ entries, currentValaId, roleLevel }: AppendOnlyLedgerProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter entries - lower roles see less detail
  const visibleEntries = entries.filter(entry => {
    if (roleLevel === 'master') return true;
    if (roleLevel === 'ai_head') return entry.valaId === currentValaId || entry.status === 'flagged';
    return entry.valaId === currentValaId;
  });

  const filteredEntries = visibleEntries.filter(entry =>
    entry.actionHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.valaId.includes(searchTerm)
  );

  const maskContent = (content: string, level: string) => {
    if (level === 'master') return content;
    // Mask for lower roles
    return content.slice(0, 4) + '••••' + content.slice(-4);
  };

  return (
    <Card className="bg-neutral-900/50 border-neutral-800 select-none">
      <CardHeader className="border-b border-neutral-800">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-neutral-300">
            <div className="w-8 h-8 rounded bg-neutral-800 flex items-center justify-center">
              <FileText className="h-4 w-4 text-neutral-400" />
            </div>
            Append-Only Ledger
          </CardTitle>
          <Badge variant="outline" className="bg-neutral-800 text-neutral-400 border-neutral-700">
            <Lock className="h-3 w-3 mr-1" />
            IMMUTABLE
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <Input
            placeholder="Search by hash or Vala ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-neutral-950 border-neutral-800 text-neutral-300"
          />
        </div>

        {/* Ledger Info */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="p-3 rounded bg-neutral-950 border border-neutral-800 text-center">
            <div className="text-lg font-mono text-neutral-300">{entries.length}</div>
            <div className="text-xs text-neutral-500 uppercase tracking-wider">Total Entries</div>
          </div>
          <div className="p-3 rounded bg-neutral-950 border border-neutral-800 text-center">
            <div className="text-lg font-mono text-neutral-300">
              {entries[entries.length - 1]?.blockNumber || 0}
            </div>
            <div className="text-xs text-neutral-500 uppercase tracking-wider">Latest Block</div>
          </div>
          <div className="p-3 rounded bg-neutral-950 border border-neutral-800 text-center">
            <div className="text-lg font-mono text-green-400">
              {entries.filter(e => e.status === 'verified').length}
            </div>
            <div className="text-xs text-neutral-500 uppercase tracking-wider">Verified</div>
          </div>
        </div>

        {/* Entries */}
        <ScrollArea className="h-[400px]">
          <div className="space-y-2">
            {filteredEntries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-3 rounded border ${
                  entry.status === 'flagged'
                    ? 'bg-red-950/20 border-red-900/30'
                    : 'bg-neutral-950 border-neutral-800'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Hash className="h-3 w-3 text-neutral-500" />
                      <span className="font-mono text-xs text-neutral-400">
                        {maskContent(entry.actionHash, roleLevel)}
                      </span>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          entry.status === 'verified' 
                            ? 'bg-green-950/50 text-green-400 border-green-800/50'
                            : entry.status === 'flagged'
                            ? 'bg-red-950/50 text-red-400 border-red-800/50'
                            : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                        }`}
                      >
                        {entry.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-neutral-500">
                      <span className="flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        {roleLevel === 'master' ? entry.valaId : maskContent(entry.valaId, roleLevel)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {entry.timestamp}
                      </span>
                      <span>Block #{entry.blockNumber}</span>
                    </div>
                    
                    {roleLevel === 'master' && (
                      <div className="text-xs text-neutral-400 mt-2">
                        {entry.action}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>

        {/* Ledger Notice */}
        <div className="mt-4 p-3 rounded bg-neutral-950 border border-neutral-800">
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <Lock className="h-3 w-3" />
            <span>No delete • No edit • Append-only • All entries permanent</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
