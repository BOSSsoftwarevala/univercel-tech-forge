import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useGlobalBlacklist, BlacklistEntryType, ListType } from '@/hooks/useGlobalBlacklist';
import { toast } from 'sonner';
import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

interface AddBlacklistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddBlacklistDialog({ open, onOpenChange, onSuccess }: AddBlacklistDialogProps) {
  const { addToBlacklist, addToWhitelist } = useGlobalBlacklist();
  
  const [listType, setListType] = useState<ListType>('blacklist');
  const [entryType, setEntryType] = useState<BlacklistEntryType>('email');
  const [value, setValue] = useState('');
  const [reason, setReason] = useState('');
  const [expiresIn, setExpiresIn] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!value.trim() || !reason.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      let expiresAt: string | undefined;
      if (expiresIn) {
        const days = parseInt(expiresIn);
        if (!isNaN(days)) {
          const date = new Date();
          date.setDate(date.getDate() + days);
          expiresAt = date.toISOString();
        }
      }

      let result;
      if (listType === 'whitelist') {
        result = await addToWhitelist(value, entryType, reason);
      } else {
        result = await addToBlacklist(value, entryType, reason, expiresAt);
      }

      if (result) {
        toast.success(`Entry added to ${listType}`);
        setValue('');
        setReason('');
        setExpiresIn('');
        onSuccess?.();
      } else {
        toast.error('Failed to add entry');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add to Access List</DialogTitle>
          <DialogDescription>
            Add an identifier to the blacklist, whitelist, or watchlist
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* List Type */}
          <div className="space-y-2">
            <Label>List Type</Label>
            <RadioGroup
              value={listType}
              onValueChange={(v) => setListType(v as ListType)}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="blacklist" id="blacklist" />
                <Label htmlFor="blacklist" className="flex items-center gap-1 cursor-pointer">
                  <ShieldAlert className="h-4 w-4 text-red-500" />
                  Blacklist
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="whitelist" id="whitelist" />
                <Label htmlFor="whitelist" className="flex items-center gap-1 cursor-pointer">
                  <ShieldCheck className="h-4 w-4 text-green-500" />
                  Whitelist
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="watchlist" id="watchlist" />
                <Label htmlFor="watchlist" className="flex items-center gap-1 cursor-pointer">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  Watchlist
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Entry Type */}
          <div className="space-y-2">
            <Label>Entry Type</Label>
            <select
              value={entryType}
              onChange={(e) => setEntryType(e.target.value as BlacklistEntryType)}
              className="w-full px-3 py-2 rounded-md border bg-background"
            >
              <option value="email">Email Address</option>
              <option value="phone">Phone Number</option>
              <option value="device">Device Fingerprint</option>
              <option value="ip">IP Address</option>
              <option value="document">Document ID</option>
              <option value="card">Payment Card Hash</option>
              <option value="wallet">Wallet Address</option>
            </select>
          </div>

          {/* Value */}
          <div className="space-y-2">
            <Label>Value *</Label>
            <Input
              placeholder={
                entryType === 'email' ? 'user@example.com' :
                entryType === 'phone' ? '+1234567890' :
                entryType === 'ip' ? '192.168.1.1' :
                'Enter value...'
              }
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Value will be hashed for GDPR compliance
            </p>
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label>Reason *</Label>
            <Textarea
              placeholder="Why is this being added to the list?"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>

          {/* Expiration */}
          {listType === 'blacklist' && (
            <div className="space-y-2">
              <Label>Expires In (days)</Label>
              <Input
                type="number"
                placeholder="Leave empty for permanent"
                value={expiresIn}
                onChange={(e) => setExpiresIn(e.target.value)}
                min="1"
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Entry'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
