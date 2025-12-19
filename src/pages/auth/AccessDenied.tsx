import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShieldX, Home, ArrowLeft, LogIn } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const AccessDenied = () => {
  const navigate = useNavigate();
  const { user, userRole } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-destructive/5 p-4">
      <Card className="w-full max-w-md border-destructive/30 bg-card/80 backdrop-blur-xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
            <ShieldX className="w-8 h-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold">Access Denied</CardTitle>
          <CardDescription>
            You don't have permission to access this page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertDescription className="text-sm">
              Your current role ({userRole || 'Guest'}) does not have access to the requested resource.
            </AlertDescription>
          </Alert>
          
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <h4 className="font-medium text-sm">What you can do:</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Return to your dashboard</li>
              <li>Contact your administrator for access</li>
              <li>Log in with a different account</li>
            </ul>
          </div>

          {user && (
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Current Role:</span>
                <span className="font-medium capitalize">{userRole?.replace('_', ' ') || 'None'}</span>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          {user ? (
            <Button onClick={() => navigate('/dashboard')} className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Button>
          ) : (
            <Button onClick={() => navigate('/login')} className="w-full">
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          )}
          <Button variant="outline" onClick={() => navigate(-1)} className="w-full">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AccessDenied;
