import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Crown, Shield, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const BootstrapAdmins = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [masterEmail] = useState('hellosoftwarevala@gmail.com');
  const [masterPassword, setMasterPassword] = useState('');
  const [superAdminEmail] = useState('superadmin@softwarevala.com');
  const [superAdminPassword, setSuperAdminPassword] = useState('');

  const handleBootstrap = async () => {
    if (!masterPassword || !superAdminPassword) {
      toast.error('Please enter passwords for both accounts');
      return;
    }

    if (masterPassword.length < 6 || superAdminPassword.length < 6) {
      toast.error('Passwords must be at least 6 characters');
      return;
    }

    setLoading(true);
    const bootstrapResults: any[] = [];

    try {
      // Create Master Admin
      const { data: masterData, error: masterError } = await supabase.auth.signUp({
        email: masterEmail,
        password: masterPassword,
        options: {
          data: {
            full_name: 'Master Admin',
            role: 'master'
          }
        }
      });

      if (masterError) {
        if (masterError.message.includes('already registered')) {
          bootstrapResults.push({ email: masterEmail, status: 'exists', message: 'Already registered - try logging in' });
        } else {
          bootstrapResults.push({ email: masterEmail, status: 'error', message: masterError.message });
        }
      } else if (masterData.user) {
        // Insert role directly
        const { error: roleError } = await supabase.from('user_roles').upsert({
          user_id: masterData.user.id,
          role: 'master',
          approval_status: 'approved',
          approved_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

        if (roleError) {
          bootstrapResults.push({ email: masterEmail, status: 'partial', message: 'User created but role assignment failed: ' + roleError.message });
        } else {
          bootstrapResults.push({ email: masterEmail, status: 'success', message: 'Master Admin created successfully!' });
        }
      }

      // Sign out before creating next user
      await supabase.auth.signOut();

      // Create Super Admin
      const { data: superData, error: superError } = await supabase.auth.signUp({
        email: superAdminEmail,
        password: superAdminPassword,
        options: {
          data: {
            full_name: 'Super Admin',
            role: 'super_admin'
          }
        }
      });

      if (superError) {
        if (superError.message.includes('already registered')) {
          bootstrapResults.push({ email: superAdminEmail, status: 'exists', message: 'Already registered - try logging in' });
        } else {
          bootstrapResults.push({ email: superAdminEmail, status: 'error', message: superError.message });
        }
      } else if (superData.user) {
        const { error: roleError } = await supabase.from('user_roles').upsert({
          user_id: superData.user.id,
          role: 'super_admin',
          approval_status: 'approved',
          approved_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

        if (roleError) {
          bootstrapResults.push({ email: superAdminEmail, status: 'partial', message: 'User created but role assignment failed: ' + roleError.message });
        } else {
          bootstrapResults.push({ email: superAdminEmail, status: 'success', message: 'Super Admin created successfully!' });
        }
      }

      // Sign out after creation
      await supabase.auth.signOut();

      setResults(bootstrapResults);
      
      const hasSuccess = bootstrapResults.some(r => r.status === 'success');
      if (hasSuccess) {
        toast.success('Admin accounts created! You can now log in.');
      }

    } catch (error: any) {
      toast.error('Bootstrap failed: ' + error.message);
      bootstrapResults.push({ email: 'system', status: 'error', message: error.message });
      setResults(bootstrapResults);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-yellow-500/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg border-yellow-500/30">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center mb-4 shadow-lg shadow-yellow-500/20">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Bootstrap Admin Accounts</CardTitle>
          <CardDescription>
            Create the Master Admin and Super Admin accounts for initial system setup
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Master Admin */}
          <div className="space-y-3 p-4 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-yellow-500" />
              <h3 className="font-semibold text-foreground">Master Admin</h3>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Email (fixed)</Label>
              <Input value={masterEmail} disabled className="bg-muted/50" />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input 
                type="password" 
                value={masterPassword} 
                onChange={(e) => setMasterPassword(e.target.value)}
                placeholder="Enter Master Admin password"
              />
            </div>
          </div>

          {/* Super Admin */}
          <div className="space-y-3 p-4 rounded-lg bg-purple-500/5 border border-purple-500/20">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-500" />
              <h3 className="font-semibold text-foreground">Super Admin</h3>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Email (fixed)</Label>
              <Input value={superAdminEmail} disabled className="bg-muted/50" />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input 
                type="password" 
                value={superAdminPassword} 
                onChange={(e) => setSuperAdminPassword(e.target.value)}
                placeholder="Enter Super Admin password"
              />
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
                  {result.status === 'success' ? (
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

          <Button 
            onClick={handleBootstrap} 
            disabled={loading}
            className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating Accounts...
              </>
            ) : (
              <>
                <Crown className="w-4 h-4 mr-2" />
                Create Admin Accounts
              </>
            )}
          </Button>

          <div className="text-center space-y-2">
            <Button variant="link" onClick={() => navigate('/auth')}>
              Go to Login
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Note: This page should only be used once during initial setup.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BootstrapAdmins;
