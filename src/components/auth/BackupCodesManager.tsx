import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Key, Copy, Download, RefreshCw, AlertTriangle, CheckCircle, Shield } from "lucide-react";

export function BackupCodesManager() {
  const queryClient = useQueryClient();
  const [showCodes, setShowCodes] = useState(false);
  const [generatedCodes, setGeneratedCodes] = useState<string[]>([]);

  const { data: backupCodesInfo, isLoading } = useQuery({
    queryKey: ['backup-codes-info'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('backup_codes')
        .select('id, is_used, created_at')
        .eq('user_id', user.id);

      if (error) throw error;

      const total = data?.length || 0;
      const used = data?.filter(c => c.is_used).length || 0;
      const available = total - used;
      const createdAt = data?.[0]?.created_at;

      return { total, used, available, createdAt };
    }
  });

  const generateCodes = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase.rpc('generate_backup_codes', {
        p_user_id: user.id
      });

      if (error) throw error;
      return data as string[];
    },
    onSuccess: (codes) => {
      setGeneratedCodes(codes);
      setShowCodes(true);
      queryClient.invalidateQueries({ queryKey: ['backup-codes-info'] });
      toast.success('New backup codes generated');
    },
    onError: (error) => {
      toast.error(`Failed to generate codes: ${error.message}`);
    }
  });

  const copyAllCodes = () => {
    const codesText = generatedCodes.join('\n');
    navigator.clipboard.writeText(codesText);
    toast.success('Codes copied to clipboard');
  };

  const downloadCodes = () => {
    const content = `SOFTWARE VALA - Backup Recovery Codes
Generated: ${new Date().toLocaleString()}

IMPORTANT: Keep these codes in a safe place. Each code can only be used once.

${generatedCodes.map((code, i) => `${i + 1}. ${code}`).join('\n')}

If you lose access to your 2FA device, use one of these codes to sign in.
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'software-vala-backup-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Codes downloaded');
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Backup Recovery Codes
          </CardTitle>
          <CardDescription>
            Use these one-time codes to access your account if you lose your 2FA device
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {backupCodesInfo && backupCodesInfo.total > 0 ? (
            <>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-muted/50 text-center">
                  <p className="text-2xl font-bold">{backupCodesInfo.total}</p>
                  <p className="text-sm text-muted-foreground">Total Codes</p>
                </div>
                <div className="p-4 rounded-lg bg-green-500/10 text-center">
                  <p className="text-2xl font-bold text-green-500">{backupCodesInfo.available}</p>
                  <p className="text-sm text-muted-foreground">Available</p>
                </div>
                <div className="p-4 rounded-lg bg-yellow-500/10 text-center">
                  <p className="text-2xl font-bold text-yellow-500">{backupCodesInfo.used}</p>
                  <p className="text-sm text-muted-foreground">Used</p>
                </div>
              </div>

              {backupCodesInfo.available <= 3 && (
                <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="font-medium">Low on backup codes</p>
                      <p className="text-sm text-muted-foreground">
                        Consider generating new codes to ensure account recovery options
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Generate New Codes
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Generate New Backup Codes?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will invalidate all existing unused backup codes. 
                      Make sure to save the new codes in a safe place.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => generateCodes.mutate()}>
                      Generate New Codes
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          ) : (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="font-medium mb-2">No backup codes generated</p>
              <p className="text-sm text-muted-foreground mb-4">
                Generate backup codes to ensure you can access your account if you lose your 2FA device
              </p>
              <Button onClick={() => generateCodes.mutate()}>
                <Key className="h-4 w-4 mr-2" />
                Generate Backup Codes
              </Button>
            </div>
          )}

          <div className="p-3 rounded-lg bg-muted/50">
            <p className="text-xs text-muted-foreground">
              <strong>Note:</strong> Each backup code can only be used once. 
              Store them securely offline - do not share them or store them in the cloud.
            </p>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showCodes} onOpenChange={setShowCodes}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Backup Codes Generated
            </DialogTitle>
            <DialogDescription>
              Save these codes in a safe place. They won't be shown again.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-4 rounded-lg bg-muted/50 border">
              <div className="grid grid-cols-2 gap-2">
                {generatedCodes.map((code, index) => (
                  <div 
                    key={index}
                    className="p-2 rounded bg-background font-mono text-sm text-center"
                  >
                    {code}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={copyAllCodes}>
                <Copy className="h-4 w-4 mr-2" />
                Copy All
              </Button>
              <Button variant="outline" className="flex-1" onClick={downloadCodes}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>

            <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                <div className="text-xs">
                  <p className="font-medium text-foreground">Important</p>
                  <p className="text-muted-foreground">
                    These codes will not be shown again. Save them now in a secure location.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setShowCodes(false)}>
              I've Saved My Codes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}