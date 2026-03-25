import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Users, Loader2, CheckCircle, AlertCircle, ArrowLeft, 
  Plus, Trash2, Upload, UserPlus 
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import type { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];

interface UserToCreate {
  id: string;
  email: string;
  password: string;
  role: AppRole;
}

interface CreationResult {
  email: string;
  status: 'success' | 'error' | 'exists';
  message: string;
}

// All available roles from the database enum
const AVAILABLE_ROLES: AppRole[] = [
  'super_admin', 'admin', 'franchise', 'reseller', 'influencer',
  'client', 'prime', 'developer', 'demo_manager', 'task_manager', 
  'promise_management', 'assist_manager', 'ai_manager', 'api_security',
  'marketing_manager', 'client_success', 'seo_manager', 'lead_manager',
  'rnd_manager', 'performance_manager', 'finance_manager', 'legal_compliance',
  'hr_manager', 'support', 'r_and_d', 'safe_assist', 'promise_tracker'
];

const BulkUserCreation = () => {
  const navigate = useNavigate();
  const { user, userRole } = useAuth();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UserToCreate[]>([
    { id: crypto.randomUUID(), email: '', password: '', role: 'client' }
  ]);
  const [results, setResults] = useState<CreationResult[]>([]);
  const [bulkInput, setBulkInput] = useState('');
  const [showBulkInput, setShowBulkInput] = useState(false);

  // Only master and super_admin can access
  if (userRole !== 'master' && userRole !== 'super_admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-destructive/30">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">Only Master and Super Admin can create users.</p>
            <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const addUser = () => {
    setUsers([...users, { 
      id: crypto.randomUUID(), 
      email: '', 
      password: '', 
      role: 'client' 
    }]);
  };

  const removeUser = (id: string) => {
    if (users.length > 1) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const updateUser = (id: string, field: keyof UserToCreate, value: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, [field]: value } : u));
  };

  const parseBulkInput = () => {
    const lines = bulkInput.trim().split('\n').filter(line => line.trim());
    const parsed: UserToCreate[] = [];
    
    for (const line of lines) {
      // Format: email,password,role or email password role
      const parts = line.includes(',') 
        ? line.split(',').map(p => p.trim())
        : line.split(/\s+/).map(p => p.trim());
      
      if (parts.length >= 2) {
        const email = parts[0];
        const password = parts[1];
        const roleStr = (parts[2] || 'client').toLowerCase().replace(/\s+/g, '_');
        const role = AVAILABLE_ROLES.includes(roleStr as AppRole) 
          ? roleStr as AppRole 
          : 'client';
        
        parsed.push({
          id: crypto.randomUUID(),
          email,
          password,
          role
        });
      }
    }
    
    if (parsed.length > 0) {
      setUsers(parsed);
      setShowBulkInput(false);
      setBulkInput('');
      toast.success(`Parsed ${parsed.length} users`);
    } else {
      toast.error('No valid users found. Format: email,password,role');
    }
  };

  const createUsers = async () => {
    // Validate
    const validUsers = users.filter(u => u.email && u.password);
    if (validUsers.length === 0) {
      toast.error('Please add at least one user with email and password');
      return;
    }

    setLoading(true);
    const creationResults: CreationResult[] = [];

    for (const userData of validUsers) {
      try {
        // Sign up user (auto-confirmed)
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: userData.email,
          password: userData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
          }
        });

        if (signUpError) {
          if (signUpError.message.includes('already registered')) {
            creationResults.push({
              email: userData.email,
              status: 'exists',
              message: 'User already exists'
            });
          } else {
            creationResults.push({
              email: userData.email,
              status: 'error',
              message: signUpError.message
            });
          }
          continue;
        }

        if (signUpData.user) {
          // Assign role
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert({
              user_id: signUpData.user.id,
              role: userData.role,
              approval_status: 'pending'
            });

          if (roleError) {
            creationResults.push({
              email: userData.email,
              status: 'error',
              message: `Created but role failed: ${roleError.message}`
            });
          } else {
            creationResults.push({
              email: userData.email,
              status: 'success',
              message: `Created with role: ${userData.role}`
            });
          }
        }
      } catch (error) {
        creationResults.push({
          email: userData.email,
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    setResults(creationResults);

    // Log audit
    if (user?.id && userRole) {
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: 'bulk_user_creation',
        module: 'user_management',
        role: userRole,
        meta_json: {
          total: validUsers.length,
          success: creationResults.filter(r => r.status === 'success').length,
          failed: creationResults.filter(r => r.status === 'error').length,
          exists: creationResults.filter(r => r.status === 'exists').length
        }
      });
    }

    const successCount = creationResults.filter(r => r.status === 'success').length;
    if (successCount > 0) {
      toast.success(`Created ${successCount} users successfully`);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" />
              Bulk User Creation
            </h1>
            <p className="text-sm text-muted-foreground">
              Create multiple users with roles at once
            </p>
          </div>
        </div>

        {/* Bulk Input Toggle */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Add Users</CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowBulkInput(!showBulkInput)}
              >
                <Upload className="w-4 h-4 mr-2" />
                {showBulkInput ? 'Manual Entry' : 'Bulk Paste'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {showBulkInput ? (
              <div className="space-y-4">
                <div>
                  <Label>Paste user data (one per line)</Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Format: email,password,role (e.g., user@example.com,password123,franchise)
                  </p>
                  <Textarea
                    value={bulkInput}
                    onChange={(e) => setBulkInput(e.target.value)}
                    placeholder="user1@example.com,password123,franchise&#10;user2@example.com,password456,reseller&#10;user3@example.com,password789,client"
                    rows={10}
                    className="font-mono text-sm"
                  />
                </div>
                <Button onClick={parseBulkInput} className="w-full">
                  Parse & Load Users
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <ScrollArea className="max-h-[400px]">
                  <div className="space-y-3 pr-4">
                    {users.map((userData, index) => (
                      <div key={userData.id} className="flex gap-2 items-start p-3 rounded-lg bg-muted/30 border">
                        <span className="text-xs text-muted-foreground mt-2 w-6">
                          {index + 1}.
                        </span>
                        <div className="flex-1 grid grid-cols-3 gap-2">
                          <div>
                            <Label className="text-xs">Email</Label>
                            <Input
                              type="email"
                              value={userData.email}
                              onChange={(e) => updateUser(userData.id, 'email', e.target.value)}
                              placeholder="user@example.com"
                              className="h-9"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Password</Label>
                            <Input
                              type="text"
                              value={userData.password}
                              onChange={(e) => updateUser(userData.id, 'password', e.target.value)}
                              placeholder="password"
                              className="h-9"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Role</Label>
                            <Select
                              value={userData.role}
                              onValueChange={(value) => updateUser(userData.id, 'role', value)}
                            >
                              <SelectTrigger className="h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {AVAILABLE_ROLES.map((r) => (
                                  <SelectItem key={r} value={r}>
                                    {r.replace(/_/g, ' ')}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeUser(userData.id)}
                          disabled={users.length === 1}
                          className="mt-5"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={addUser} className="flex-1">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Another User
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create Button */}
        {!showBulkInput && (
          <Button
            onClick={createUsers}
            disabled={loading || users.every(u => !u.email || !u.password)}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating Users...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Create {users.filter(u => u.email && u.password).length} Users
              </>
            )}
          </Button>
        )}

        {/* Results */}
        {results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Creation Results</CardTitle>
              <CardDescription>
                {results.filter(r => r.status === 'success').length} created, 
                {' '}{results.filter(r => r.status === 'exists').length} already existed,
                {' '}{results.filter(r => r.status === 'error').length} failed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-[300px]">
                <div className="space-y-2">
                  {results.map((result, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-2 p-2 rounded-lg text-sm ${
                        result.status === 'success' ? 'bg-green-500/10 text-green-500' :
                        result.status === 'exists' ? 'bg-amber-500/10 text-amber-500' :
                        'bg-red-500/10 text-red-500'
                      }`}
                    >
                      {result.status === 'success' ? (
                        <CheckCircle className="w-4 h-4 flex-shrink-0" />
                      ) : result.status === 'exists' ? (
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      )}
                      <span className="font-medium">{result.email}</span>
                      <span className="text-xs opacity-80">- {result.message}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}

        {/* Info */}
        <p className="text-xs text-center text-muted-foreground">
          Users will need to be approved after creation. All actions are logged to audit trail.
        </p>
      </div>
    </div>
  );
};

export default BulkUserCreation;
