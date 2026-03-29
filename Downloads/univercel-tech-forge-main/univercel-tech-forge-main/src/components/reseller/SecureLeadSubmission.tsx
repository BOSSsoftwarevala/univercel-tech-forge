import { useState } from 'react';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  UserPlus, Phone, Package, FileText, Send, 
  AlertTriangle, CheckCircle, XCircle, Loader2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import type { ResellerAccountData } from '@/hooks/useResellerGuard';

// Lead submission schema with validation
const leadSchema = z.object({
  clientName: z.string()
    .trim()
    .min(2, 'Client name must be at least 2 characters')
    .max(100, 'Client name must be less than 100 characters')
    .regex(/^[a-zA-Z\s\-'.]+$/, 'Client name can only contain letters, spaces, hyphens, and apostrophes'),
  clientContact: z.string()
    .trim()
    .min(10, 'Contact number must be at least 10 digits')
    .max(15, 'Contact number must be less than 15 digits')
    .regex(/^[+]?[\d\s\-()]+$/, 'Invalid contact number format'),
  product: z.string()
    .min(1, 'Please select a product'),
  notes: z.string()
    .max(500, 'Notes must be less than 500 characters')
    .optional()
});

type LeadFormData = z.infer<typeof leadSchema>;

interface SecureLeadSubmissionProps {
  resellerAccount: ResellerAccountData;
  canSubmitLeads: boolean;
  onSuccess?: () => void;
}

// Mock products - in production, fetch from database
const PRODUCTS = [
  { id: 'erp-basic', name: 'ERP Basic' },
  { id: 'erp-pro', name: 'ERP Pro' },
  { id: 'crm-starter', name: 'CRM Starter' },
  { id: 'crm-enterprise', name: 'CRM Enterprise' },
  { id: 'inventory-management', name: 'Inventory Management' },
  { id: 'accounting-suite', name: 'Accounting Suite' },
];

export const SecureLeadSubmission = ({ 
  resellerAccount, 
  canSubmitLeads,
  onSuccess 
}: SecureLeadSubmissionProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      clientName: '',
      clientContact: '',
      product: '',
      notes: ''
    }
  });

  const selectedProduct = watch('product');

  // Check for duplicate leads
  const checkDuplicate = async (contact: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('reseller_leads')
        .select('id, lead_name, status')
        .eq('masked_contact', contact.slice(-4))
        .limit(1);

      if (error) throw error;
      
      if (data && data.length > 0) {
        setDuplicateWarning(`Similar contact found: ${data[0].lead_name} (${data[0].status})`);
        return true;
      }
      
      setDuplicateWarning(null);
      return false;
    } catch {
      return false;
    }
  };

  // Log submission to audit
  const logSubmission = async (leadData: LeadFormData, success: boolean, leadId?: string) => {
    try {
      await supabase.from('audit_logs').insert({
        user_id: resellerAccount.user_id,
        action: success ? 'LEAD_SUBMITTED' : 'LEAD_SUBMISSION_FAILED',
        module: 'reseller_leads',
        role: 'reseller',
        meta_json: {
          reseller_id: resellerAccount.id,
          reseller_code: resellerAccount.reseller_code,
          product: leadData.product,
          lead_id: leadId,
          timestamp: new Date().toISOString()
          // Note: Never log client contact or PII
        }
      });
    } catch {
      // Silent fail for audit logging
    }
  };

  const onSubmit = async (data: LeadFormData) => {
    if (!canSubmitLeads) {
      toast.error('You cannot submit leads at this time');
      return;
    }

    setSubmitting(true);

    try {
      // Check for duplicates
      const isDuplicate = await checkDuplicate(data.clientContact);
      if (isDuplicate) {
        toast.warning('A similar lead may already exist. Please verify before submitting.');
      }

      // Mask contact for storage (show only last 4 digits)
      const maskedContact = `***-***-${data.clientContact.slice(-4)}`;

      // Submit lead
      const { data: newLead, error } = await supabase
        .from('reseller_leads')
        .insert({
          reseller_id: resellerAccount.id,
          lead_name: data.clientName,
          masked_contact: maskedContact,
          industry: data.product,
          ai_notes: data.notes || null,
          status: 'submitted',
          priority: 'medium'
        })
        .select('id')
        .single();

      if (error) throw error;

      await logSubmission(data, true, newLead?.id);
      
      toast.success('Lead submitted successfully!');
      reset();
      onSuccess?.();
    } catch (error) {
      await logSubmission(data, false);
      toast.error('Failed to submit lead. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!canSubmitLeads) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 rounded-xl bg-gradient-to-br from-red-500/10 to-rose-500/10 border border-red-500/20"
      >
        <div className="flex items-center gap-3">
          <XCircle className="w-6 h-6 text-red-400" />
          <div>
            <h3 className="font-semibold text-red-400">Lead Submission Disabled</h3>
            <p className="text-sm text-slate-400 mt-1">
              {resellerAccount.status === 'pending' 
                ? 'Your account is pending activation. You cannot submit leads yet.'
                : 'Your account is suspended. Contact support for assistance.'
              }
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-emerald-500/20"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30">
          <UserPlus className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h3 className="font-semibold text-white">Submit New Lead</h3>
          <p className="text-xs text-slate-400">Quality leads only • No bulk uploads</p>
        </div>
      </div>

      {/* Duplicate Warning */}
      {duplicateWarning && (
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <p className="text-sm text-amber-400">{duplicateWarning}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Client Name */}
        <div className="space-y-2">
          <Label htmlFor="clientName" className="text-slate-300 flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-emerald-400" />
            Client Name *
          </Label>
          <Input
            id="clientName"
            {...register('clientName')}
            placeholder="Enter client name"
            className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-emerald-500/50"
          />
          {errors.clientName && (
            <p className="text-xs text-red-400">{errors.clientName.message}</p>
          )}
        </div>

        {/* Client Contact */}
        <div className="space-y-2">
          <Label htmlFor="clientContact" className="text-slate-300 flex items-center gap-2">
            <Phone className="w-4 h-4 text-emerald-400" />
            Client Contact *
          </Label>
          <Input
            id="clientContact"
            {...register('clientContact')}
            placeholder="Enter contact number"
            className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-emerald-500/50"
            onBlur={(e) => checkDuplicate(e.target.value)}
          />
          {errors.clientContact && (
            <p className="text-xs text-red-400">{errors.clientContact.message}</p>
          )}
        </div>

        {/* Product Selection */}
        <div className="space-y-2">
          <Label className="text-slate-300 flex items-center gap-2">
            <Package className="w-4 h-4 text-emerald-400" />
            Product *
          </Label>
          <Select onValueChange={(value) => setValue('product', value)} value={selectedProduct}>
            <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-white">
              <SelectValue placeholder="Select a product" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              {PRODUCTS.map((product) => (
                <SelectItem 
                  key={product.id} 
                  value={product.id}
                  className="text-white hover:bg-slate-700 focus:bg-slate-700"
                >
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.product && (
            <p className="text-xs text-red-400">{errors.product.message}</p>
          )}
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes" className="text-slate-300 flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            Notes (Optional)
          </Label>
          <Textarea
            id="notes"
            {...register('notes')}
            placeholder="Add any relevant notes about this lead..."
            rows={3}
            className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-emerald-500/50 resize-none"
          />
          {errors.notes && (
            <p className="text-xs text-red-400">{errors.notes.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={submitting}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Submit Lead
            </>
          )}
        </Button>
      </form>

      {/* Disclaimer */}
      <p className="text-[10px] text-slate-500 mt-4 text-center">
        By submitting, you confirm this is a genuine lead. Fraudulent submissions may result in account suspension.
      </p>
    </motion.div>
  );
};

export default SecureLeadSubmission;
