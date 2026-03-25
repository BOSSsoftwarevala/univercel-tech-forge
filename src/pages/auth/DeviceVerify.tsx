import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Smartphone, Monitor, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const DeviceVerify = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState({
    browser: '',
    os: '',
    device: '',
    trusted: false,
  });

  useEffect(() => {
    // Detect device info
    const ua = navigator.userAgent;
    let browser = 'Unknown';
    let os = 'Unknown';
    let device = 'Desktop';

    if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Safari')) browser = 'Safari';
    else if (ua.includes('Edge')) browser = 'Edge';

    if (ua.includes('Windows')) os = 'Windows';
    else if (ua.includes('Mac')) os = 'macOS';
    else if (ua.includes('Linux')) os = 'Linux';
    else if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

    if (ua.includes('Mobile')) device = 'Mobile';
    else if (ua.includes('Tablet')) device = 'Tablet';

    setDeviceInfo({ browser, os, device, trusted: false });
  }, []);

  const handleTrustDevice = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setDeviceInfo((prev) => ({ ...prev, trusted: true }));
    toast.success('Device trusted successfully!');
    navigate('/ip-verify');
    setLoading(false);
  };

  const handleSkip = () => {
    toast.info('Device not trusted. You may need to verify again.');
    navigate('/ip-verify');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-md border-border/50 bg-card/80 backdrop-blur-xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            {deviceInfo.device === 'Mobile' ? (
              <Smartphone className="w-6 h-6 text-primary" />
            ) : (
              <Monitor className="w-6 h-6 text-primary" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold">New Device Detected</CardTitle>
          <CardDescription>
            Trust this device for future logins?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Browser</span>
              <span className="text-sm font-medium">{deviceInfo.browser}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Operating System</span>
              <span className="text-sm font-medium">{deviceInfo.os}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Device Type</span>
              <span className="text-sm font-medium">{deviceInfo.device}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Status</span>
              <span className={`text-sm font-medium flex items-center gap-1 ${deviceInfo.trusted ? 'text-green-500' : 'text-yellow-500'}`}>
                {deviceInfo.trusted ? (
                  <>
                    <CheckCircle className="w-4 h-4" /> Trusted
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" /> Unverified
                  </>
                )}
              </span>
            </div>
          </div>
          <Alert>
            <AlertDescription className="text-sm">
              Trusting this device means you won't need to verify it again for 30 days.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button onClick={handleTrustDevice} className="w-full" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
            Trust This Device
          </Button>
          <Button variant="outline" onClick={handleSkip} className="w-full">
            Skip for Now
          </Button>
          <Link to="/login" className="text-sm text-muted-foreground hover:text-primary text-center">
            Back to login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DeviceVerify;
