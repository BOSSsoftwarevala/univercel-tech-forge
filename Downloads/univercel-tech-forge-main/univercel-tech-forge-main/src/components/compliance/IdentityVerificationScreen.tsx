import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Upload, 
  Camera, 
  CheckCircle, 
  AlertTriangle, 
  User,
  CreditCard,
  Calendar,
  Shield,
  Globe,
  Fingerprint,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useComplianceSystem } from '@/hooks/useComplianceSystem';
import { AppRole } from '@/types/roles';

interface IdentityVerificationScreenProps {
  role?: AppRole;
  onComplete?: (data: VerificationData) => void;
  isCompleted?: boolean;
}

interface VerificationData {
  idFrontUrl?: string;
  idBackUrl?: string;
  livenessPhotoUrl?: string;
  fullName: string;
  dateOfBirth: string;
}

export const IdentityVerificationScreen = ({ 
  role = 'client',
  onComplete,
  isCompleted = false 
}: IdentityVerificationScreenProps) => {
  const { submitIdentityVerification, isLoading } = useComplianceSystem();
  const [step, setStep] = useState<'id' | 'liveness' | 'details'>('id');
  const [idFront, setIdFront] = useState<File | null>(null);
  const [idBack, setIdBack] = useState<File | null>(null);
  const [livenessPhoto, setLivenessPhoto] = useState<File | null>(null);
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (file: File | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      setter(file);
      toast.success('File uploaded successfully');
    }
  };

  const handleSubmit = async () => {
    if (!idFront || !idBack || !livenessPhoto || !fullName || !dateOfBirth) {
      toast.error('Please complete all verification steps');
      return;
    }

    setIsSubmitting(true);
    
    // Submit to database
    const success = await submitIdentityVerification(role, {
      fullName,
      dateOfBirth,
      idFrontUrl: URL.createObjectURL(idFront),
      idBackUrl: URL.createObjectURL(idBack),
      livenessPhotoUrl: URL.createObjectURL(livenessPhoto),
    });
    
    if (success && onComplete) {
      onComplete({
        idFrontUrl: URL.createObjectURL(idFront),
        idBackUrl: URL.createObjectURL(idBack),
        livenessPhotoUrl: URL.createObjectURL(livenessPhoto),
        fullName,
        dateOfBirth,
      });
    }
    
    setIsSubmitting(false);
  };

  if (isCompleted) {
    return (
      <Card className="bg-green-500/5 border-green-500/30">
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
          <h3 className="text-xl font-semibold text-green-500 mb-2">
            Identity Verified
          </h3>
          <p className="text-muted-foreground">
            Your identity has been successfully verified
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Progress Steps */}
      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {[
              { id: 'id', label: 'Government ID', icon: CreditCard },
              { id: 'liveness', label: 'Liveness Check', icon: Camera },
              { id: 'details', label: 'Personal Details', icon: User },
            ].map((s, index) => (
              <div key={s.id} className="flex items-center">
                <div 
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                    step === s.id 
                      ? 'bg-primary/10 text-primary' 
                      : (idFront && idBack && s.id === 'id') || (livenessPhoto && s.id === 'liveness') || (fullName && dateOfBirth && s.id === 'details')
                        ? 'bg-green-500/10 text-green-500'
                        : 'bg-muted/50 text-muted-foreground'
                  }`}
                  onClick={() => setStep(s.id as 'id' | 'liveness' | 'details')}
                >
                  <s.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{s.label}</span>
                </div>
                {index < 2 && (
                  <div className="w-12 h-px bg-border mx-2" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ID Upload Step */}
      {step === 'id' && (
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Government ID Upload
            </CardTitle>
            <CardDescription>
              Upload clear photos of your government-issued ID (front and back)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Front ID */}
              <div className="space-y-3">
                <Label>Front of ID</Label>
                <div 
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    idFront ? 'border-green-500/50 bg-green-500/5' : 'border-muted hover:border-primary/50'
                  }`}
                >
                  {idFront ? (
                    <div className="space-y-2">
                      <CheckCircle className="w-8 h-8 mx-auto text-green-500" />
                      <p className="text-sm text-green-500 font-medium">{idFront.name}</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Click to upload</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => handleFileUpload(e, setIdFront)}
                  />
                </div>
              </div>

              {/* Back ID */}
              <div className="space-y-3">
                <Label>Back of ID</Label>
                <div 
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors relative ${
                    idBack ? 'border-green-500/50 bg-green-500/5' : 'border-muted hover:border-primary/50'
                  }`}
                >
                  {idBack ? (
                    <div className="space-y-2">
                      <CheckCircle className="w-8 h-8 mx-auto text-green-500" />
                      <p className="text-sm text-green-500 font-medium">{idBack.name}</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Click to upload</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => handleFileUpload(e, setIdBack)}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={() => setStep('liveness')}
                disabled={!idFront || !idBack}
              >
                Continue to Liveness Check
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liveness Check Step */}
      {step === 'liveness' && (
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Liveness Check
            </CardTitle>
            <CardDescription>
              Take a live photo to verify your identity matches your ID
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div 
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors relative ${
                livenessPhoto ? 'border-green-500/50 bg-green-500/5' : 'border-muted hover:border-primary/50'
              }`}
            >
              {livenessPhoto ? (
                <div className="space-y-3">
                  <CheckCircle className="w-12 h-12 mx-auto text-green-500" />
                  <p className="text-lg text-green-500 font-medium">Photo Captured</p>
                  <p className="text-sm text-muted-foreground">{livenessPhoto.name}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <Camera className="w-12 h-12 mx-auto text-muted-foreground" />
                  <p className="text-lg font-medium">Take a Photo</p>
                  <p className="text-sm text-muted-foreground">
                    Look directly at the camera and ensure good lighting
                  </p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                capture="user"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => handleFileUpload(e, setLivenessPhoto)}
              />
            </div>

            <div className="bg-muted/30 rounded-lg p-4">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                Photo Requirements
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Face must be clearly visible and centered</li>
                <li>• Good lighting, no shadows on face</li>
                <li>• No sunglasses or hats</li>
                <li>• Neutral expression</li>
              </ul>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep('id')}>
                Back
              </Button>
              <Button
                onClick={() => setStep('details')}
                disabled={!livenessPhoto}
              >
                Continue to Details
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Personal Details Step */}
      {step === 'details' && (
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Details
            </CardTitle>
            <CardDescription>
              Enter your details exactly as they appear on your ID
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Legal Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="As shown on your ID"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                />
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium text-primary">Data Security</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your personal information is encrypted and stored securely. 
                    It will only be used for identity verification purposes.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep('liveness')}>
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!fullName || !dateOfBirth || isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Verification'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      <Card className="bg-muted/20 border-muted">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Badge variant={idFront && idBack ? 'default' : 'outline'} className="text-xs">
                  ID: {idFront && idBack ? 'Complete' : 'Pending'}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={livenessPhoto ? 'default' : 'outline'} className="text-xs">
                  Liveness: {livenessPhoto ? 'Complete' : 'Pending'}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={fullName && dateOfBirth ? 'default' : 'outline'} className="text-xs">
                  Details: {fullName && dateOfBirth ? 'Complete' : 'Pending'}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default IdentityVerificationScreen;
