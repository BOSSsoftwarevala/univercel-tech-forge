import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, LogOut, Settings as SettingsIcon, ArrowLeft, Shield, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, userRole } = useAuth();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loading2FA, setLoading2FA] = useState(false);

  useEffect(() => {
    document.title = "Settings | Software Vala";
    fetchTwoFactorStatus();
  }, [user]);

  const fetchTwoFactorStatus = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('two_factor_enabled')
        .eq('user_id', user.id)
        .single();
      
      if (!error && data) {
        setTwoFactorEnabled(data.two_factor_enabled || false);
      }
    } catch (err) {
      console.error('Error fetching 2FA status:', err);
    }
  };

  const handleToggle2FA = async (enabled: boolean) => {
    if (!user) return;
    
    setLoading2FA(true);
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ 
          two_factor_enabled: enabled,
          two_factor_method: enabled ? 'email' : null 
        })
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      setTwoFactorEnabled(enabled);
      toast.success(enabled ? 'Two-Factor Authentication enabled' : 'Two-Factor Authentication disabled');
    } catch (err) {
      console.error('Error updating 2FA:', err);
      toast.error('Failed to update 2FA settings');
    } finally {
      setLoading2FA(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto max-w-3xl px-4 py-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <SettingsIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Settings</h1>
                <p className="text-sm text-muted-foreground">Account and security</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => navigate("/dashboard")} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-4 py-8 space-y-6">
        {/* Account Card */}
        <Card className="border-border/50 bg-card/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-foreground">Your account</CardTitle>
            <CardDescription>
              Signed in as <span className="font-medium text-foreground">{user?.email ?? ""}</span>
              {userRole ? (
                <>
                  {" "}• Role: <span className="font-medium text-foreground">{userRole}</span>
                </>
              ) : null}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={() => navigate("/change-password")} className="w-full justify-start gap-2">
              <Lock className="h-4 w-4" />
              Change password
            </Button>
            <Button variant="destructive" onClick={() => navigate("/logout")} className="w-full justify-start gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </CardContent>
        </Card>

        {/* Security Card - 2FA */}
        <Card className="border-border/50 bg-card/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Shield className="h-5 w-5 text-primary" />
              Security
            </CardTitle>
            <CardDescription>
              Protect your account with additional security measures
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Smartphone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <Label className="text-foreground font-medium">Two-Factor Authentication</Label>
                  <p className="text-xs text-muted-foreground">
                    {twoFactorEnabled 
                      ? "Your account is protected with 2FA" 
                      : "Add an extra layer of security to your account"}
                  </p>
                </div>
              </div>
              <Switch
                checked={twoFactorEnabled}
                onCheckedChange={handleToggle2FA}
                disabled={loading2FA}
              />
            </div>
            
            {twoFactorEnabled && (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-sm text-emerald-400">
                ✓ Two-Factor Authentication is enabled via email OTP
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
