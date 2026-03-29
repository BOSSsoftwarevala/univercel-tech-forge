import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import {
  connectFactoryGitHubAccount,
  importAllFactoryGitHubRepos,
  listFactoryGitHubAccounts,
  listFactoryGitHubRepos,
  syncFactoryGitHubRepos,
  type FactoryGitHubAccount,
  type FactoryGitHubRepo,
} from '@/lib/api/vala-factory';
import { Github, RefreshCw, DownloadCloud, Link2, GitBranch } from 'lucide-react';

const PMGitHubIntegration: React.FC = () => {
  const [accounts, setAccounts] = useState<FactoryGitHubAccount[]>([]);
  const [repos, setRepos] = useState<FactoryGitHubRepo[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async (accountId?: string) => {
    try {
      const accountResponse = await listFactoryGitHubAccounts();
      const nextAccounts = accountResponse.data.items || [];
      setAccounts(nextAccounts);
      const resolvedAccountId = accountId || selectedAccountId || nextAccounts[0]?.id || '';
      setSelectedAccountId(resolvedAccountId);
      const repoResponse = await listFactoryGitHubRepos(resolvedAccountId || undefined);
      setRepos(repoResponse.data.items || []);
    } catch (error) {
      console.error('Failed to load GitHub integration data', error);
      toast.error(error instanceof Error ? error.message : 'Failed to load GitHub integration data');
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const connectAccount = async () => {
    if (!token.trim()) {
      toast.error('GitHub personal token is required');
      return;
    }
    setLoading(true);
    try {
      const response = await connectFactoryGitHubAccount({ token: token.trim() });
      toast.success(`Connected ${response.data.account.username}`);
      setToken('');
      await load(response.data.account.id);
    } catch (error) {
      console.error('Failed to connect GitHub account', error);
      toast.error(error instanceof Error ? error.message : 'Failed to connect GitHub account');
    } finally {
      setLoading(false);
    }
  };

  const importRepos = async (syncMode: 'import' | 'sync') => {
    setLoading(true);
    try {
      const action = syncMode === 'import' ? importAllFactoryGitHubRepos : syncFactoryGitHubRepos;
      const response = await action(selectedAccountId ? { account_id: selectedAccountId } : undefined);
      toast.success(`${response.data.repos_processed} repos processed, ${response.data.products_created} products created`);
      await load(selectedAccountId);
    } catch (error) {
      console.error('Failed to import GitHub repos', error);
      toast.error(error instanceof Error ? error.message : 'Failed to import GitHub repos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-slate-800 to-slate-950 text-white">
            <Github className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">GitHub Integration</h1>
            <p className="text-sm text-muted-foreground">Connect BOSSsoftwarevala, import repos, detect tech stack, and create factory products automatically</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select value={selectedAccountId} onChange={(event) => void load(event.target.value)} className="rounded-md border bg-background px-3 py-2 text-sm">
            {accounts.map((account) => <option key={account.id} value={account.id}>{account.username}</option>)}
          </select>
          <Button variant="outline" onClick={() => void load(selectedAccountId)} disabled={loading}><RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh</Button>
        </div>
      </div>

      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-sm">Connect GitHub Account</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 md:flex-row">
          <Input value={token} onChange={(event) => setToken(event.target.value)} placeholder="GitHub personal access token" />
          <Button onClick={() => void connectAccount()} disabled={loading}><Link2 className="mr-2 h-4 w-4" /> Connect</Button>
          <Button variant="outline" onClick={() => void importRepos('import')} disabled={loading || !accounts.length}><DownloadCloud className="mr-2 h-4 w-4" /> Import All Repos</Button>
          <Button variant="outline" onClick={() => void importRepos('sync')} disabled={loading || !accounts.length}><RefreshCw className="mr-2 h-4 w-4" /> Sync Repos</Button>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="text-sm">Connected Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {accounts.map((account) => (
              <button type="button" key={account.id} onClick={() => void load(account.id)} className={`w-full rounded-lg border p-3 text-left transition-all ${selectedAccountId === account.id ? 'border-primary bg-primary/5' : 'border-border/50 hover:border-primary/30'}`}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{account.username}</p>
                    <p className="text-xs text-muted-foreground">{account.token_hint}</p>
                  </div>
                  <Badge variant="outline">{account.status}</Badge>
                </div>
              </button>
            ))}
            {!accounts.length ? <p className="text-sm text-muted-foreground">No GitHub account connected yet.</p> : null}
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="text-sm">Imported Repositories</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-18rem)]">
              <div className="divide-y divide-border/50">
                {repos.map((repo, index) => (
                  <motion.div key={repo.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.03 }} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">{repo.full_name}</p>
                        <p className="text-xs text-muted-foreground break-all">{repo.repo_url}</p>
                      </div>
                      <Badge variant="outline">{repo.import_status}</Badge>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><GitBranch className="h-3 w-3" /> {repo.branch}</span>
                      <Badge variant="secondary">{repo.tech_stack}</Badge>
                      <span>Size: {repo.size}</span>
                      <span>Commit: {repo.last_commit ? String(repo.last_commit).slice(0, 12) : 'n/a'}</span>
                    </div>
                  </motion.div>
                ))}
                {!repos.length ? <div className="p-6 text-sm text-muted-foreground">No imported repositories yet. Connect GitHub and click Import All Repos.</div> : null}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PMGitHubIntegration;