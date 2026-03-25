import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Ban, Mail, Phone, ArrowLeft } from 'lucide-react';

const AccountSuspension = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-destructive/5 p-4">
      <Card className="w-full max-w-md border-destructive/30 bg-card/80 backdrop-blur-xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
            <Ban className="w-8 h-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold text-destructive">Account Suspended</CardTitle>
          <CardDescription>
            Your account has been temporarily suspended
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertDescription className="text-sm">
              Your account has been suspended due to a violation of our terms of service or suspicious activity.
            </AlertDescription>
          </Alert>
          
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <h4 className="font-medium text-sm">Possible Reasons:</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Multiple login attempts from different locations</li>
              <li>Violation of platform policies</li>
              <li>Suspicious financial transactions</li>
              <li>Account security concerns</li>
            </ul>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <h4 className="font-medium text-sm">Next Steps:</h4>
            <div className="space-y-2">
              <a 
                href="mailto:support@softwarevala.com" 
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <Mail className="w-4 h-4" />
                support@softwarevala.com
              </a>
              <a 
                href="tel:+911234567890" 
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <Phone className="w-4 h-4" />
                +91 123-456-7890
              </a>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button asChild variant="outline" className="w-full">
            <a href="mailto:support@softwarevala.com">
              <Mail className="w-4 h-4 mr-2" />
              Contact Support
            </a>
          </Button>
          <Link to="/login" className="text-sm text-muted-foreground hover:text-primary text-center inline-flex items-center justify-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AccountSuspension;
