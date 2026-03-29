import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, LogOut } from 'lucide-react';
import { toast } from 'sonner';

const Logout = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  useEffect(() => {
    const performLogout = async () => {
      // Auto-end any Safe Assist sessions before logout
      if (user?.id) {
        try {
          await supabase.rpc('end_user_safe_assist_on_logout', {
            p_user_id: user.id
          });
        } catch (err) {
          // Silent fail - don't block logout
          console.warn('Failed to end Safe Assist sessions:', err);
        }
      }
      
      await signOut();
      toast.success('Logged out successfully');
      
      // Block back button by replacing history
      navigate('/auth', { replace: true });
    };
    performLogout();
  }, [signOut, navigate, user?.id]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-md border-border/50 bg-card/80 backdrop-blur-xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <LogOut className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Signing Out</CardTitle>
          <CardDescription>
            Please wait while we securely log you out
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    </div>
  );
};

export default Logout;
