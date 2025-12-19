import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Globe, MapPin, CheckCircle, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

const IPVerify = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [ipInfo, setIpInfo] = useState({
    ip: '',
    city: '',
    country: '',
    isp: '',
    verified: false,
  });

  useEffect(() => {
    // Simulate IP lookup
    const fetchIP = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIpInfo({
        ip: '192.168.1.xxx',
        city: 'Mumbai',
        country: 'India',
        isp: 'Jio Fiber',
        verified: false,
      });
      setVerifying(false);
    };
    fetchIP();
  }, []);

  const handleVerify = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIpInfo((prev) => ({ ...prev, verified: true }));
    toast.success('IP verified successfully! Redirecting...');
    setTimeout(() => navigate('/dashboard'), 1000);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-md border-border/50 bg-card/80 backdrop-blur-xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <Globe className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">IP Verification</CardTitle>
          <CardDescription>
            Verifying your location for security
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {verifying ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
              <p className="text-sm text-muted-foreground">Detecting your location...</p>
            </div>
          ) : (
            <>
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">IP Address</span>
                  <span className="text-sm font-medium font-mono">{ipInfo.ip}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> City
                  </span>
                  <span className="text-sm font-medium">{ipInfo.city}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Country</span>
                  <span className="text-sm font-medium">{ipInfo.country}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">ISP</span>
                  <span className="text-sm font-medium">{ipInfo.isp}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span className={`text-sm font-medium flex items-center gap-1 ${ipInfo.verified ? 'text-green-500' : 'text-yellow-500'}`}>
                    {ipInfo.verified ? (
                      <>
                        <CheckCircle className="w-4 h-4" /> Verified
                      </>
                    ) : (
                      <>Pending Verification</>
                    )}
                  </span>
                </div>
              </div>
              <Alert>
                <AlertDescription className="text-sm">
                  Your IP will be logged for security. Multiple IPs may require re-verification.
                </AlertDescription>
              </Alert>
            </>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button onClick={handleVerify} className="w-full" disabled={loading || verifying}>
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ShieldCheck className="w-4 h-4 mr-2" />}
            Verify & Continue
          </Button>
          <Link to="/login" className="text-sm text-muted-foreground hover:text-primary text-center">
            Back to login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default IPVerify;
