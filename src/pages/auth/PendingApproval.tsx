import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, LogOut, RefreshCw, Mail, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const PendingApproval = () => {
  const navigate = useNavigate();
  const { user, signOut, userRole } = useAuth();
  const [checking, setChecking] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState<string>('pending');

  useEffect(() => {
    if (!user) {
      navigate('/auth', { replace: true });
    }
  }, [user, navigate]);

  const checkApprovalStatus = async () => {
    if (!user) return;
    
    setChecking(true);
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('approval_status, role')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data?.approval_status === 'approved') {
        setApprovalStatus('approved');
        // Redirect to dashboard after a moment
        setTimeout(() => navigate('/dashboard', { replace: true }), 1500);
      } else if (data?.approval_status === 'rejected') {
        setApprovalStatus('rejected');
      } else {
        setApprovalStatus('pending');
      }
    } catch (err) {
      console.error('Error checking approval status:', err);
    } finally {
      setChecking(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/auth', { replace: true });
  };

  const handleBrowseDemos = () => {
    navigate('/demos/public');
  };

  if (approvalStatus === 'approved') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-green-500/5 p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground">Account Approved!</h2>
          <p className="text-muted-foreground mt-2">Redirecting to your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  if (approvalStatus === 'rejected') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-destructive/5 p-4">
        <Card className="w-full max-w-md border-destructive/30">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-destructive" />
            </div>
            <CardTitle className="text-xl">Account Not Approved</CardTitle>
            <CardDescription>
              Unfortunately, your account request was not approved. Please contact support for more information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full" onClick={handleBrowseDemos}>
              Browse Public Demos
            </Button>
            <Button variant="ghost" className="w-full" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-amber-500/5 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md border-amber-500/30 bg-card/80 backdrop-blur-xl">
          <CardHeader className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="mx-auto w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mb-4"
            >
              <Clock className="w-8 h-8 text-amber-500" />
            </motion.div>
            <CardTitle className="text-xl">Awaiting Approval</CardTitle>
            <CardDescription>
              Your account has been created successfully! An administrator will review and approve your access soon.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Role requested:</span>{' '}
                <span className="capitalize">{userRole?.replace(/_/g, ' ') || 'Pending'}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                You'll receive access once approved by Master or Super Admin
              </p>
            </div>

            <Button 
              variant="outline" 
              className="w-full" 
              onClick={checkApprovalStatus}
              disabled={checking}
            >
              {checking ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Check Approval Status
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">or</span>
              </div>
            </div>

            <Button variant="secondary" className="w-full" onClick={handleBrowseDemos}>
              Browse Public Demos
            </Button>

            <Button variant="ghost" className="w-full text-muted-foreground" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PendingApproval;