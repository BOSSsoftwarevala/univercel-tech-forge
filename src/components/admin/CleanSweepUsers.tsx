import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Shield, Trash2, CheckCircle, AlertTriangle } from "lucide-react";

const PERMANENT_USERS = [
  { email: "manojcopy264@gmail.com", role: "boss_owner", grade: "GRADE 0 — OWNERSHIP" },
  { email: "ceo@gmail.com", role: "ceo", grade: "GRADE 0 — EXECUTIVE" },
  { email: "admin@gmail.com", role: "admin", grade: "GRADE 1" },
  { email: "servermanager@gmail.com", role: "server_manager", grade: "GRADE 1" },
  { email: "franchisemanager@gmail.com", role: "franchise_manager", grade: "GRADE 2 — BUSINESS" },
  { email: "salesmanager@gmail.com", role: "sales_support", grade: "GRADE 2" },
  { email: "resellermanager@gmail.com", role: "reseller_manager", grade: "GRADE 2" },
  { email: "apimanager@gmail.com", role: "api_ai_manager", grade: "GRADE 2" },
  { email: "influencermanager@gmail.com", role: "influencer_manager", grade: "GRADE 2" },
  { email: "seomanager@gmail.com", role: "seo_manager", grade: "GRADE 2" },
  { email: "marketingmanager@gmail.com", role: "marketing_manager", grade: "GRADE 2" },
  { email: "leadmanager@gmail.com", role: "lead_manager", grade: "GRADE 2" },
  { email: "promanager@gmail.com", role: "pro_manager", grade: "GRADE 2" },
  { email: "legalmanager@gmail.com", role: "legal_manager", grade: "GRADE 2" },
  { email: "taskmanager@gmail.com", role: "task_manager", grade: "GRADE 2" },
  { email: "hrmanager@gmail.com", role: "hr_manager", grade: "GRADE 2" },
  { email: "developermanager@gmail.com", role: "developer_manager", grade: "GRADE 2" },
  { email: "franchise@gmail.com", role: "franchise", grade: "GRADE 3 — PARTNERS" },
  { email: "developer@gmail.com", role: "developer", grade: "GRADE 3" },
  { email: "reseller@gmail.com", role: "reseller", grade: "GRADE 3" },
  { email: "influencer@gmail.com", role: "influencer", grade: "GRADE 3" },
  { email: "primeuser@gmail.com", role: "prime_user", grade: "GRADE 4 — USERS" },
  { email: "user@gmail.com", role: "user", grade: "GRADE 4" },
  { email: "safeassist@gmail.com", role: "safe_assist", grade: "GRADE 4" },
  { email: "assistmanager@gmail.com", role: "assist_manager", grade: "GRADE 4" },
  { email: "promisetracker@gmail.com", role: "promise_tracker", grade: "GRADE 4" },
  { email: "promisemanagement@gmail.com", role: "promise_management", grade: "GRADE 4" },
  { email: "demomanager@gmail.com", role: "demo_manager", grade: "GRADE 4" },
];

const CleanSweepUsers = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [confirmed, setConfirmed] = useState(false);

  const executeCleanSweep = async () => {
    if (!confirmed) {
      setConfirmed(true);
      return;
    }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Not authenticated");
        return;
      }

      const response = await supabase.functions.invoke("bootstrap-all-users", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (response.error) {
        toast.error(response.error.message);
        return;
      }

      setResult(response.data);
      toast.success(`Clean sweep complete! ${response.data.total_active} users active, ${response.data.removed_count} removed`);
    } catch (err) {
      toast.error("Failed to execute clean sweep");
    } finally {
      setLoading(false);
      setConfirmed(false);
    }
  };

  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <Shield className="w-5 h-5" />
          Clean Sweep — Permanent Users Only
        </CardTitle>
        <CardDescription>
          Remove ALL users except the 28 permanent accounts. This action is irreversible.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* User List */}
        <div className="max-h-64 overflow-y-auto border rounded-lg p-3 bg-muted/30">
          <div className="grid gap-1 text-xs">
            {PERMANENT_USERS.map((user, i) => (
              <div key={user.email} className="flex justify-between items-center py-1 border-b border-border/30 last:border-0">
                <span className="font-mono">{user.email}</span>
                <span className="text-muted-foreground">{user.role}</span>
              </div>
            ))}
          </div>
        </div>

        {confirmed && (
          <Alert variant="destructive">
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription>
              <strong>FINAL WARNING:</strong> This will DELETE all users not in the list above. Click again to confirm.
            </AlertDescription>
          </Alert>
        )}

        {result && (
          <Alert className="border-green-500/50 bg-green-500/10">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <AlertDescription>
              <strong>Complete!</strong> {result.total_active} permanent users active, {result.removed_count} users removed.
            </AlertDescription>
          </Alert>
        )}

        <Button
          variant={confirmed ? "destructive" : "outline"}
          onClick={executeCleanSweep}
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4 mr-2" />
          )}
          {confirmed ? "CONFIRM CLEAN SWEEP" : "Execute Clean Sweep"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CleanSweepUsers;
