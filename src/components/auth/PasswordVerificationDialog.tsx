import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Lock, AlertTriangle, Eye, EyeOff, Shield } from "lucide-react";

interface PasswordVerificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void;
  actionType: string;
  actionDescription: string;
}

export function PasswordVerificationDialog({
  isOpen,
  onClose,
  onVerified,
  actionType,
  actionDescription
}: PasswordVerificationDialogProps) {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const verifyPassword = async () => {
    if (!password) {
      toast.error('Please enter your password');
      return;
    }

    if (attempts >= 3) {
      toast.error('Too many failed attempts. Please try again later.');
      onClose();
      return;
    }

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) throw new Error('Not authenticated');

      // Re-authenticate with password
      const { error } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: password
      });

      if (error) {
        setAttempts(prev => prev + 1);
        throw new Error('Incorrect password');
      }

      // Log the password verification
      await supabase.from('password_verifications').insert({
        user_id: user.id,
        action_type: actionType
      });

      // Log to audit
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: 'password_verified',
        module: 'security',
        meta_json: {
          action_type: actionType,
          action_description: actionDescription
        }
      });

      toast.success('Password verified');
      setPassword("");
      setAttempts(0);
      onVerified();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getActionSeverity = () => {
    if (actionType.includes('delete') || actionType.includes('remove')) {
      return { color: 'destructive', icon: AlertTriangle, label: 'Destructive Action' };
    }
    if (actionType.includes('financial') || actionType.includes('payment')) {
      return { color: 'default', icon: Lock, label: 'Financial Action' };
    }
    return { color: 'secondary', icon: Shield, label: 'Sensitive Action' };
  };

  const severity = getActionSeverity();
  const SeverityIcon = severity.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-yellow-500" />
            Password Verification Required
          </DialogTitle>
          <DialogDescription>
            Confirm your identity to proceed with this action
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <SeverityIcon className="h-4 w-4" />
              <Badge variant={severity.color as any}>{severity.label}</Badge>
            </div>
            <p className="text-sm font-medium">{actionType}</p>
            <p className="text-xs text-muted-foreground mt-1">{actionDescription}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Enter your password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                onKeyDown={(e) => e.key === 'Enter' && verifyPassword()}
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {attempts > 0 && (
            <div className="flex items-center gap-2 text-destructive text-sm">
              <AlertTriangle className="h-4 w-4" />
              <span>{3 - attempts} attempts remaining</span>
            </div>
          )}

          <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
              <div className="text-xs text-muted-foreground">
                <p className="font-medium text-foreground">Why is this required?</p>
                <p>Password verification ensures that critical actions are only performed by the account owner. This protects your data and prevents unauthorized modifications.</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            onClick={verifyPassword}
            disabled={isLoading || !password}
          >
            {isLoading ? 'Verifying...' : 'Verify & Continue'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}