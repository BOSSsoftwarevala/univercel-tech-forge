/**
 * NEW INQUIRY FLOW
 * Text • Voice Note • Photo
 * NO file download • NO external links
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mic, Image, Send, X, Clock } from 'lucide-react';
import { toast } from 'sonner';

const issueTypes = [
  { value: 'support', label: 'Support' },
  { value: 'dev', label: 'Development' },
  { value: 'sales', label: 'Sales' },
  { value: 'legal', label: 'Legal' },
  { value: 'server', label: 'Server' },
];

export const ICBNewInquiry: React.FC = () => {
  const [issueType, setIssueType] = useState('');
  const [priority, setPriority] = useState('normal');
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleSubmit = () => {
    if (!issueType || !message.trim()) {
      toast.error('Please fill all required fields');
      return;
    }
    toast.success('Inquiry submitted - Waiting for approval');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">New Inquiry</h1>
        <p className="text-muted-foreground">Submit a secure inquiry to internal team</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Create Inquiry</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Issue Type */}
          <div className="space-y-2">
            <Label>Issue Type *</Label>
            <Select value={issueType} onValueChange={setIssueType}>
              <SelectTrigger>
                <SelectValue placeholder="Select issue type" />
              </SelectTrigger>
              <SelectContent>
                {issueTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Priority - Locked until approval */}
          <div className="space-y-2">
            <Label>Priority</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="urgent" disabled>
                  Urgent (Requires Approval)
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Urgent priority requires manager approval
            </p>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label>Describe Your Issue *</Label>
            <Textarea
              placeholder="Type your issue here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[120px]"
            />
          </div>

          {/* Media Options */}
          <div className="flex items-center gap-3">
            <Button
              variant={isRecording ? "destructive" : "outline"}
              size="sm"
              onClick={() => {
                setIsRecording(!isRecording);
                if (!isRecording) {
                  toast.info('Recording voice note...');
                } else {
                  toast.success('Voice note recorded');
                }
              }}
            >
              <Mic className="h-4 w-4 mr-2" />
              {isRecording ? 'Stop Recording' : 'Voice Note'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info('Photo upload - Sensitive areas will be auto-blurred')}
            >
              <Image className="h-4 w-4 mr-2" />
              Add Photo
            </Button>
          </div>

          {/* Security Notice */}
          <div className="p-3 bg-muted rounded-lg text-xs text-muted-foreground">
            <p className="font-medium mb-1">Security Notice:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>No file downloads allowed</li>
              <li>Sensitive areas auto-blurred in photos</li>
              <li>No external links supported</li>
              <li>All communications are logged</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => {
              setIssueType('');
              setMessage('');
            }}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              <Send className="h-4 w-4 mr-2" />
              Submit Inquiry
            </Button>
          </div>

          {/* Status After Submit */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>After submission: Status → WAITING FOR APPROVAL</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ICBNewInquiry;
