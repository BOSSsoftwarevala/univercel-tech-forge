import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, LogOut, Settings as SettingsIcon, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, userRole } = useAuth();

  useEffect(() => {
    document.title = "Settings | Software Vala";
  }, []);

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

      <section className="mx-auto max-w-3xl px-4 py-8">
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
      </section>
    </main>
  );
}
