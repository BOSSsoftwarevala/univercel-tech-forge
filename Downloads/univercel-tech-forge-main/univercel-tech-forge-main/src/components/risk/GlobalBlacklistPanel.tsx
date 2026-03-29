import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Plus, 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  Trash2, 
  AlertTriangle,
  Clock,
  Globe,
  Smartphone,
  Mail,
  Phone,
  CreditCard,
  Wallet,
  FileText
} from 'lucide-react';
import { 
  useGlobalBlacklist, 
  BlacklistEntry, 
  BlacklistEntryType,
  getRiskBadgeColor 
} from '@/hooks/useGlobalBlacklist';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { AddBlacklistDialog } from './AddBlacklistDialog';
import { UserRiskCardComponent } from './UserRiskCard';

export function GlobalBlacklistPanel() {
  const { 
    entries, 
    isLoading, 
    searchBlacklist, 
    fetchBlacklistEntries,
    removeFromBlacklist 
  } = useGlobalBlacklist();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<BlacklistEntryType>('email');
  const [activeTab, setActiveTab] = useState<'blacklist' | 'whitelist' | 'search'>('blacklist');
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    fetchBlacklistEntries(activeTab === 'search' ? undefined : activeTab);
  }, [activeTab, fetchBlacklistEntries]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    await searchBlacklist(searchQuery, searchType);
  };

  const getEntryIcon = (type: BlacklistEntryType) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      case 'device': return <Smartphone className="h-4 w-4" />;
      case 'ip': return <Globe className="h-4 w-4" />;
      case 'document': return <FileText className="h-4 w-4" />;
      case 'card': return <CreditCard className="h-4 w-4" />;
      case 'wallet': return <Wallet className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const getListTypeColor = (type: string) => {
    switch (type) {
      case 'blacklist': return 'bg-red-500/10 text-red-500';
      case 'whitelist': return 'bg-green-500/10 text-green-500';
      case 'watchlist': return 'bg-yellow-500/10 text-yellow-500';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-red-500" />
            Global Blacklist & Risk Engine
          </h2>
          <p className="text-muted-foreground">
            Manage blocked users, devices, and identifiers
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Entry
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10">
                <ShieldAlert className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {entries.filter(e => e.list_type === 'blacklist').length}
                </div>
                <div className="text-sm text-muted-foreground">Blacklisted</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <ShieldCheck className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {entries.filter(e => e.list_type === 'whitelist').length}
                </div>
                <div className="text-sm text-muted-foreground">Whitelisted</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {entries.filter(e => e.list_type === 'watchlist').length}
                </div>
                <div className="text-sm text-muted-foreground">Watchlist</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Clock className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {entries.filter(e => e.expires_at && new Date(e.expires_at) > new Date()).length}
                </div>
                <div className="text-sm text-muted-foreground">Expiring Soon</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & List */}
      <Card>
        <CardHeader>
          <CardTitle>Access Control List</CardTitle>
          <CardDescription>
            Search and manage blacklisted/whitelisted entries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList className="mb-4">
              <TabsTrigger value="blacklist" className="gap-2">
                <ShieldAlert className="h-4 w-4" />
                Blacklist
              </TabsTrigger>
              <TabsTrigger value="whitelist" className="gap-2">
                <ShieldCheck className="h-4 w-4" />
                Whitelist
              </TabsTrigger>
              <TabsTrigger value="search" className="gap-2">
                <Search className="h-4 w-4" />
                Search
              </TabsTrigger>
            </TabsList>

            <TabsContent value="search">
              <div className="flex gap-4 mb-6">
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value as BlacklistEntryType)}
                  className="px-3 py-2 rounded-md border bg-background"
                >
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="device">Device</option>
                  <option value="ip">IP Address</option>
                  <option value="document">Document ID</option>
                  <option value="card">Card</option>
                  <option value="wallet">Wallet</option>
                </select>
                <Input
                  placeholder="Enter value to search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleSearch} disabled={isLoading}>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </TabsContent>

            {/* Entries List */}
            <div className="space-y-2">
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading...
                </div>
              ) : entries.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No entries found
                </div>
              ) : (
                entries.map((entry) => (
                  <BlacklistEntryRow
                    key={entry.id}
                    entry={entry}
                    onRemove={removeFromBlacklist}
                    getEntryIcon={getEntryIcon}
                    getListTypeColor={getListTypeColor}
                  />
                ))
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <AddBlacklistDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
        onSuccess={() => {
          setShowAddDialog(false);
          fetchBlacklistEntries(activeTab === 'search' ? undefined : activeTab);
        }}
      />
    </div>
  );
}

function BlacklistEntryRow({ 
  entry, 
  onRemove,
  getEntryIcon,
  getListTypeColor
}: { 
  entry: BlacklistEntry; 
  onRemove: (id: string) => void;
  getEntryIcon: (type: BlacklistEntryType) => React.ReactNode;
  getListTypeColor: (type: string) => string;
}) {
  const metadata = entry.metadata as any;

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-4">
        <div className={cn("p-2 rounded-lg", getListTypeColor(entry.list_type))}>
          {getEntryIcon(entry.entry_type)}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium">
              {metadata?.original_hint || entry.entry_value.slice(0, 16) + '...'}
            </span>
            <Badge variant="outline" className="text-xs capitalize">
              {entry.entry_type}
            </Badge>
            <Badge className={cn("text-xs capitalize", getListTypeColor(entry.list_type))}>
              {entry.list_type}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            {entry.reason || 'No reason provided'}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Added {format(new Date(entry.created_at), 'MMM d, yyyy HH:mm')}
            {entry.expires_at && (
              <span className="ml-2">
                • Expires {format(new Date(entry.expires_at), 'MMM d, yyyy')}
              </span>
            )}
          </div>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRemove(entry.id)}
        className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
