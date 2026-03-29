import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Upload, Lock, CheckCircle, AlertTriangle, Eye, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface Document {
  id: string;
  name: string;
  type: 'contract' | 'id_proof' | 'certification' | 'policy' | 'other';
  employeeId: string;
  uploadedAt: string;
  status: 'verified' | 'pending' | 'expired';
  expiryDate?: string;
}

const mockDocuments: Document[] = [
  { id: 'DOC-001', name: 'Employment Contract', type: 'contract', employeeId: 'EMP-1001', uploadedAt: '2024-01-15', status: 'verified' },
  { id: 'DOC-002', name: 'ID Verification', type: 'id_proof', employeeId: 'EMP-1001', uploadedAt: '2024-01-15', status: 'verified' },
  { id: 'DOC-003', name: 'AWS Certification', type: 'certification', employeeId: 'EMP-1001', uploadedAt: '2024-06-10', status: 'verified', expiryDate: '2025-06-10' },
  { id: 'DOC-004', name: 'Employment Contract', type: 'contract', employeeId: 'EMP-1004', uploadedAt: '2024-12-28', status: 'pending' },
  { id: 'DOC-005', name: 'Safety Certification', type: 'certification', employeeId: 'EMP-1003', uploadedAt: '2023-01-15', status: 'expired', expiryDate: '2024-01-15' },
];

const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

const getStatusConfig = (status: Document['status']) => {
  switch (status) {
    case 'verified': return { color: 'bg-emerald-500/20 text-emerald-400', icon: CheckCircle };
    case 'pending': return { color: 'bg-amber-500/20 text-amber-400', icon: AlertTriangle };
    case 'expired': return { color: 'bg-red-500/20 text-red-400', icon: AlertTriangle };
  }
};

const getTypeLabel = (type: Document['type']) => {
  switch (type) {
    case 'contract': return 'Contract';
    case 'id_proof': return 'ID Proof';
    case 'certification': return 'Certification';
    case 'policy': return 'Policy';
    case 'other': return 'Other';
  }
};

export default function HRComplianceDocuments() {
  const { toast } = useToast();
  const [documents, setDocuments] = useState(mockDocuments);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [docType, setDocType] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Only PDF, JPEG, and PNG files are allowed.",
        variant: "destructive"
      });
      return;
    }

    if (file.size > MAX_SIZE) {
      toast({
        title: "File Too Large",
        description: "Maximum file size is 5MB.",
        variant: "destructive"
      });
      return;
    }

    if (!selectedEmployee || !docType) {
      toast({
        title: "Missing Information",
        description: "Select employee and document type first.",
        variant: "destructive"
      });
      return;
    }

    console.log(`[AUDIT] Document uploaded: ${file.name} for ${selectedEmployee}`);

    toast({
      title: "Document Uploaded",
      description: "Document uploaded securely. Pending verification.",
    });

    e.target.value = '';
  };

  const verifiedCount = documents.filter(d => d.status === 'verified').length;
  const pendingCount = documents.filter(d => d.status === 'pending').length;
  const expiredCount = documents.filter(d => d.status === 'expired').length;

  return (
    <div className="space-y-4">
      {/* Access Notice */}
      <div className="flex items-center gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <Lock className="w-4 h-4 text-blue-400" />
        <span className="text-xs text-blue-400 font-mono">HR + ADMIN ACCESS ONLY • DOCUMENTS ENCRYPTED</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="bg-emerald-500/10 border-emerald-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-mono font-bold text-emerald-400">{verifiedCount}</p>
            <p className="text-xs text-emerald-400/70">Verified</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-500/10 border-amber-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-mono font-bold text-amber-400">{pendingCount}</p>
            <p className="text-xs text-amber-400/70">Pending</p>
          </CardContent>
        </Card>
        <Card className="bg-red-500/10 border-red-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-mono font-bold text-red-400">{expiredCount}</p>
            <p className="text-xs text-red-400/70">Expired</p>
          </CardContent>
        </Card>
      </div>

      {/* Upload Section */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-mono tracking-wider text-zinc-400 flex items-center gap-2">
            <Upload className="w-4 h-4" />
            SECURE UPLOAD
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
              <SelectTrigger className="bg-zinc-800 border-zinc-700 flex-1">
                <SelectValue placeholder="Select Employee" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                <SelectItem value="EMP-1001">EMP-1001</SelectItem>
                <SelectItem value="EMP-1002">EMP-1002</SelectItem>
                <SelectItem value="EMP-1003">EMP-1003</SelectItem>
                <SelectItem value="EMP-1004">EMP-1004</SelectItem>
              </SelectContent>
            </Select>
            <Select value={docType} onValueChange={setDocType}>
              <SelectTrigger className="bg-zinc-800 border-zinc-700 flex-1">
                <SelectValue placeholder="Document Type" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="id_proof">ID Proof</SelectItem>
                <SelectItem value="certification">Certification</SelectItem>
                <SelectItem value="policy">Policy</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <label className="cursor-pointer">
              <Input
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
              />
              <Button asChild>
                <span className="gap-2">
                  <Upload className="w-4 h-4" />
                  Upload
                </span>
              </Button>
            </label>
          </div>
          <p className="text-xs text-zinc-500 mt-2">
            Allowed: PDF, JPEG, PNG • Max 5MB
          </p>
        </CardContent>
      </Card>

      {/* Document List */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-mono tracking-wider text-zinc-400 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            DOCUMENT RECORDS
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {documents.map((doc, idx) => {
            const statusConfig = getStatusConfig(doc.status);
            const StatusIcon = statusConfig.icon;

            return (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/50 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-zinc-500" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{doc.name}</span>
                      <Badge variant="outline" className="text-xs font-mono">
                        {doc.employeeId}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <span>{getTypeLabel(doc.type)}</span>
                      <span>•</span>
                      <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                      {doc.expiryDate && (
                        <>
                          <span>•</span>
                          <Calendar className="w-3 h-3" />
                          <span>Expires: {new Date(doc.expiryDate).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`text-xs ${statusConfig.color}`}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {doc.status.toUpperCase()}
                  </Badge>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
