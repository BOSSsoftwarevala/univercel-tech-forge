import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Lock, FileText, Upload, Download, Eye, Shield, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface VaultDocument {
  id: string;
  name: string;
  type: 'contract' | 'agreement' | 'license' | 'compliance' | 'legal_notice';
  uploadedAt: string;
  uploadedBy: string;
  size: string;
  encrypted: boolean;
  accessLevel: 'legal_only' | 'legal_admin';
  expiryDate?: string;
}

const mockDocuments: VaultDocument[] = [
  { id: 'DOC-001', name: 'Master Service Agreement - Template', type: 'agreement', uploadedAt: '2024-01-10', uploadedBy: 'LM-A1B2', size: '245 KB', encrypted: true, accessLevel: 'legal_admin' },
  { id: 'DOC-002', name: 'Partner License Agreement v3', type: 'license', uploadedAt: '2024-01-08', uploadedBy: 'LM-C3D4', size: '189 KB', encrypted: true, accessLevel: 'legal_only' },
  { id: 'DOC-003', name: 'GDPR Compliance Report Q4', type: 'compliance', uploadedAt: '2024-01-05', uploadedBy: 'LM-A1B2', size: '1.2 MB', encrypted: true, accessLevel: 'legal_admin' },
  { id: 'DOC-004', name: 'Trademark Registration Certificate', type: 'legal_notice', uploadedAt: '2024-01-02', uploadedBy: 'LM-A1B2', size: '512 KB', encrypted: true, accessLevel: 'legal_admin', expiryDate: '2034-06-15' },
];

const LMDocumentVault: React.FC = () => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [docType, setDocType] = useState('');
  const [accessLevel, setAccessLevel] = useState('');

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'contract': return 'bg-blue-500/20 text-blue-400';
      case 'agreement': return 'bg-green-500/20 text-green-400';
      case 'license': return 'bg-purple-500/20 text-purple-400';
      case 'compliance': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleUpload = () => {
    if (!uploadFile) {
      toast.error('Please select a file');
      return;
    }
    if (!docType) {
      toast.error('Please select document type');
      return;
    }
    if (!accessLevel) {
      toast.error('Please select access level');
      return;
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(uploadFile.type)) {
      toast.error('Only PDF and Word documents are allowed');
      return;
    }

    // Validate file size (max 10MB)
    if (uploadFile.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    console.log('[LEGAL_MANAGER] Document uploaded:', {
      timestamp: new Date().toISOString(),
      action: 'document_uploaded',
      fileName: uploadFile.name,
      type: docType,
      accessLevel,
      encrypted: true
    });

    toast.success('Document uploaded and encrypted successfully');
    setIsUploadOpen(false);
    setUploadFile(null);
    setDocType('');
    setAccessLevel('');
  };

  const handleDownload = (doc: VaultDocument) => {
    console.log('[LEGAL_MANAGER] Document downloaded:', {
      timestamp: new Date().toISOString(),
      action: 'document_downloaded',
      documentId: doc.id
    });
    toast.info('Document download initiated');
  };

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <Lock className="h-5 w-5 text-primary" />
          Contract & Document Vault
          <Badge variant="outline" className="ml-2 gap-1">
            <Shield className="h-3 w-3" />
            Encrypted
          </Badge>
        </CardTitle>
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Upload className="h-4 w-4" />
              Upload
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Secure Document</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Document File *</Label>
                <Input 
                  type="file" 
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                />
                <p className="text-xs text-muted-foreground">PDF or Word documents only. Max 10MB.</p>
              </div>

              <div className="space-y-2">
                <Label>Document Type *</Label>
                <Select value={docType} onValueChange={setDocType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="agreement">Agreement</SelectItem>
                    <SelectItem value="license">License</SelectItem>
                    <SelectItem value="compliance">Compliance Report</SelectItem>
                    <SelectItem value="legal_notice">Legal Notice</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Access Level *</Label>
                <Select value={accessLevel} onValueChange={setAccessLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select access" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="legal_only">Legal Only</SelectItem>
                    <SelectItem value="legal_admin">Legal + Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-3 rounded bg-green-500/10 border border-green-500/30 text-sm">
                <Lock className="h-4 w-4 text-green-400 inline mr-2" />
                Document will be encrypted at rest with AES-256 encryption.
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsUploadOpen(false)}>Cancel</Button>
                <Button onClick={handleUpload}>Upload & Encrypt</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockDocuments.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-lg bg-background/50 border border-border/50 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-muted/50">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-medium">{doc.name}</span>
                      <Badge className={getTypeColor(doc.type)}>{doc.type.replace('_', ' ')}</Badge>
                      {doc.encrypted && (
                        <Badge variant="outline" className="text-xs gap-1">
                          <Lock className="h-3 w-3" />
                          Encrypted
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>{doc.size}</span>
                      <span>•</span>
                      <span>Uploaded: {doc.uploadedAt}</span>
                      {doc.expiryDate && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Expires: {doc.expiryDate}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="gap-1">
                    <Eye className="h-3 w-3" />
                    View
                  </Button>
                  <Button 
                    size="sm" 
                    variant="secondary"
                    onClick={() => handleDownload(doc)}
                    className="gap-1"
                  >
                    <Download className="h-3 w-3" />
                    Download
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 p-3 rounded bg-muted/30 border border-border/50 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Shield className="h-4 w-4" />
            Access: Legal + Admin only. All downloads are logged.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LMDocumentVault;
