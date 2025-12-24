import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Shield, Loader2, CheckCircle, AlertCircle, ArrowLeft, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface BootstrapResult {
  email: string;
  status: 'success' | 'exists' | 'error';
  message: string;
}

const BootstrapAdmins = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [results, setResults] = useState<BootstrapResult[]>([]);
  const [alreadyBootstrapped, setAlreadyBootstrapped] = useState(false);

  // Check if bootstrap has already been done
  useEffect(() => {
    const checkBootstrapStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .in('role', ['master', 'super_admin']);
        
        if (error) throw error;
        
        // If both master and super_admin exist, bootstrap is complete
        const roles = data?.map(r => r.role) || [];
        const hasMaster = roles.includes('master');
        const hasSuperAdmin = roles.includes('super_admin');
        
        setAlreadyBootstrapped(hasMaster && hasSuperAdmin);
      } catch (error) {
        console.error('Error checking bootstrap status:', error);
      } finally {
        setChecking(false);
      }
    };

    checkBootstrapStatus();
  }, []);

  const handleBootstrap = async () => {
    setLoading(true);
    const bootstrapResults: BootstrapResult[] = [];

    try {
      const { data, error } = await supabase.functions.invoke('bootstrap-admins', {
        body: { triggeredBy: user?.id },
      });

      if (error) {
        bootstrapResults.push({ 
          email: 'system', 
          status: 'error', 
          message: error.message 
        });
        throw error;
      }

      const fnResults = (data as { results?: Array<{ email: string; error?: string; action?: string; role?: string }> })?.results ?? [];
      fnResults.forEach((r) => {
        bootstrapResults.push({
          email: r.email,
          status: r.error ? 'error' : (r.action === 'already_exists' ? 'exists' : 'success'),
          message: r.error ? r.error : `${r.action} (${r.role})`,
        });
      });

      setResults(bootstrapResults);
      
      // Log audit trail
      if (user?.id) {
        await supabase.from('audit_logs').insert([{
          user_id: user.id,
          action: 'bootstrap_admins_executed',
          module: 'security',
          role: 'master' as const,
          meta_json: JSON.parse(JSON.stringify({ results: bootstrapResults }))
        }]);
      }

      toast.success('Bootstrap complete.');
      setAlreadyBootstrapped(true);

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      toast.error('Bootstrap failed: ' + message);
      if (bootstrapResults.length === 0) {
        bootstrapResults.push({ 
          email: 'system', 
          status: 'error', 
          message 
        });
        setResults(bootstrapResults);
      }
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-yellow-500/5 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-yellow-500/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg border-yellow-500/30">
        <CardHeader className="text-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/master-admin')}
            className="absolute top-4 left-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="mx-auto w-16 h-16 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center mb-4 shadow-lg shadow-yellow-500/20">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">System Bootstrap</CardTitle>
          <CardDescription>
            Master Admin only - Initialize system administrator accounts
          </CardDescription>
          
          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 mt-2 text-xs text-muted-foreground">
            <Lock className="w-3 h-3" />
            <span>Protected • Master Admin Access Only</span>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Already Bootstrapped Warning */}
          {alreadyBootstrapped && results.length === 0 && (
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-center">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="font-semibold text-green-400">System Already Bootstrapped</p>
              <p className="text-sm text-muted-foreground mt-1">
                Master and Super Admin accounts are already configured.
              </p>
            </div>
          )}

          {/* Info Cards */}
          <div className="space-y-3">
            <div className="p-4 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-500" />
                <h3 className="font-semibold text-foreground">Master Admin</h3>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Email configured in secure environment secrets
              </p>
            </div>

            <div className="p-4 rounded-lg bg-purple-500/5 border border-purple-500/20">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-500" />
                <h3 className="font-semibold text-foreground">Super Admin</h3>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Email configured in secure environment secrets
              </p>
            </div>
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Results:</h4>
              {results.map((result, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-start gap-2 p-3 rounded-lg text-sm ${
                    result.status === 'success' ? 'bg-green-500/10 text-green-400' :
                    result.status === 'exists' ? 'bg-amber-500/10 text-amber-400' :
                    'bg-red-500/10 text-red-400'
                  }`}
                >
                  {result.status === 'success' || result.status === 'exists' ? (
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    <p className="font-medium">{result.email}</p>
                    <p className="text-xs opacity-80">{result.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!alreadyBootstrapped && (
            <Button 
              onClick={handleBootstrap} 
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Initializing...
                </>
              ) : (
                <>
                  <Crown className="w-4 h-4 mr-2" />
                  Initialize Admin Accounts
                </>
              )}
            </Button>
          )}

          <p className="text-xs text-center text-muted-foreground">
            Passwords are securely stored in environment secrets.
            All actions are logged to the audit trail.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BootstrapAdmins;
