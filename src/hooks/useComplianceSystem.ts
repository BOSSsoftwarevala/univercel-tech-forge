import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import { AppRole } from '@/types/roles';
import { VerificationStatus, PenaltyLevel } from '@/types/compliance';

interface VerificationRecord {
  id: string;
  user_id: string;
  role: AppRole;
  current_step: string;
  step_statuses: Record<string, VerificationStatus>;
  agreement_accepted_at?: string;
  agreement_version?: string;
  identity_verified_at?: string;
  risk_score?: number;
  risk_factors?: any;
  legal_review_status?: string;
  is_activated: boolean;
  activated_at?: string;
  created_at: string;
  updated_at: string;
}

interface PenaltyRecord {
  id: string;
  user_id: string;
  user_role: AppRole;
  penalty_level: PenaltyLevel;
  reason: string;
  violation_type: string;
  evidence?: string;
  issued_by?: string;
  issued_at: string;
  is_active: boolean;
  can_appeal: boolean;
  appeal_status?: string;
  actions_taken?: any;
  created_at: string;
}

interface LegalReviewCase {
  id: string;
  user_id: string;
  user_email?: string;
  user_role: AppRole;
  review_type: string;
  status: string;
  priority: string;
  assigned_to?: string;
  documents?: any;
  risk_score?: number;
  submitted_at: string;
  reviewed_at?: string;
}

export function useComplianceSystem() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [verification, setVerification] = useState<VerificationRecord | null>(null);
  const [penalties, setPenalties] = useState<PenaltyRecord[]>([]);
  const [legalCases, setLegalCases] = useState<LegalReviewCase[]>([]);

  // Fetch verification record for current user and role
  const fetchVerification = useCallback(async (role: AppRole) => {
    if (!user) return null;
    
    setIsLoading(true);
    const { data, error } = await supabase
      .from('verification_records')
      .select('*')
      .eq('user_id', user.id)
      .eq('role', role)
      .maybeSingle();
    
    setIsLoading(false);
    
    if (error) {
      console.error('Error fetching verification:', error);
      return null;
    }
    
    if (data) {
      setVerification(data as unknown as VerificationRecord);
    }
    return data as unknown as VerificationRecord | null;
  }, [user]);

  // Accept role clauses
  const acceptRoleClauses = useCallback(async (
    role: AppRole,
    clauseId: string,
    version: string
  ) => {
    if (!user) return false;
    
    setIsLoading(true);
    
    // Insert clause agreement
    const { error: agreementError } = await supabase
      .from('role_clause_agreements')
      .upsert({
        user_id: user.id,
        role,
        clause_id: clauseId,
        clause_version: version,
        accepted_at: new Date().toISOString(),
      }, { onConflict: 'user_id,role,clause_version' });
    
    if (agreementError) {
      console.error('Error accepting clauses:', agreementError);
      toast.error('Failed to accept clauses');
      setIsLoading(false);
      return false;
    }

    // Update or create verification record
    const { error: verificationError } = await supabase
      .from('verification_records')
      .upsert({
        user_id: user.id,
        role,
        current_step: 'identity',
        step_statuses: {
          agreement: 'approved',
          identity: 'pending',
          risk_scoring: 'pending',
          legal_review: 'pending',
          activation: 'pending',
        },
        agreement_accepted_at: new Date().toISOString(),
        agreement_version: version,
      }, { onConflict: 'user_id,role' });
    
    setIsLoading(false);
    
    if (verificationError) {
      console.error('Error updating verification:', verificationError);
      toast.error('Failed to update verification');
      return false;
    }
    
    toast.success('Role clauses accepted');
    return true;
  }, [user]);

  // Submit identity verification
  const submitIdentityVerification = useCallback(async (
    role: AppRole,
    data: {
      fullName: string;
      dateOfBirth: string;
      idFrontUrl?: string;
      idBackUrl?: string;
      livenessPhotoUrl?: string;
    }
  ) => {
    if (!user) return false;
    
    setIsLoading(true);
    
    const { error } = await supabase
      .from('verification_records')
      .update({
        current_step: 'risk_scoring',
        step_statuses: {
          agreement: 'approved',
          identity: 'in_progress',
          risk_scoring: 'pending',
          legal_review: 'pending',
          activation: 'pending',
        },
        full_name: data.fullName,
        date_of_birth: data.dateOfBirth,
        id_document_front_url: data.idFrontUrl,
        id_document_back_url: data.idBackUrl,
        liveness_photo_url: data.livenessPhotoUrl,
      })
      .eq('user_id', user.id)
      .eq('role', role);
    
    setIsLoading(false);
    
    if (error) {
      console.error('Error submitting identity:', error);
      toast.error('Failed to submit identity verification');
      return false;
    }
    
    toast.success('Identity verification submitted');
    return true;
  }, [user]);

  // Fetch penalties for current user
  const fetchPenalties = useCallback(async () => {
    if (!user) return [];
    
    setIsLoading(true);
    const { data, error } = await supabase
      .from('penalty_records')
      .select('*')
      .eq('user_id', user.id)
      .order('issued_at', { ascending: false });
    
    setIsLoading(false);
    
    if (error) {
      console.error('Error fetching penalties:', error);
      return [];
    }
    
    setPenalties(data as unknown as PenaltyRecord[]);
    return data as unknown as PenaltyRecord[];
  }, [user]);

  // Fetch all penalties (admin)
  const fetchAllPenalties = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('penalty_records')
      .select('*')
      .order('issued_at', { ascending: false });
    
    setIsLoading(false);
    
    if (error) {
      console.error('Error fetching all penalties:', error);
      return [];
    }
    
    setPenalties(data as unknown as PenaltyRecord[]);
    return data as unknown as PenaltyRecord[];
  }, []);

  // Issue a penalty (admin only)
  const issuePenalty = useCallback(async (
    targetUserId: string,
    targetRole: AppRole,
    level: PenaltyLevel,
    reason: string,
    violationType: string,
    evidence?: string
  ) => {
    setIsLoading(true);
    
    const { data, error } = await supabase.rpc('issue_penalty', {
      _user_id: targetUserId,
      _user_role: targetRole,
      _penalty_level: level,
      _reason: reason,
      _violation_type: violationType,
      _evidence: evidence,
      _auto_triggered: false,
    });
    
    setIsLoading(false);
    
    if (error) {
      console.error('Error issuing penalty:', error);
      toast.error('Failed to issue penalty');
      return null;
    }
    
    toast.success('Penalty issued successfully');
    return data;
  }, []);

  // Submit appeal
  const submitAppeal = useCallback(async (penaltyId: string, appealText: string) => {
    if (!user) return false;
    
    setIsLoading(true);
    
    const { error } = await supabase
      .from('penalty_records')
      .update({
        appeal_status: 'pending',
        appeal_submitted_at: new Date().toISOString(),
        appeal_text: appealText,
      })
      .eq('id', penaltyId)
      .eq('user_id', user.id)
      .eq('can_appeal', true);
    
    setIsLoading(false);
    
    if (error) {
      console.error('Error submitting appeal:', error);
      toast.error('Failed to submit appeal');
      return false;
    }
    
    toast.success('Appeal submitted');
    return true;
  }, [user]);

  // Fetch legal review cases (admin)
  const fetchLegalCases = useCallback(async (status?: string) => {
    setIsLoading(true);
    
    let query = supabase
      .from('legal_review_cases')
      .select('*')
      .order('submitted_at', { ascending: false });
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data, error } = await query;
    
    setIsLoading(false);
    
    if (error) {
      console.error('Error fetching legal cases:', error);
      return [];
    }
    
    setLegalCases(data as unknown as LegalReviewCase[]);
    return data as unknown as LegalReviewCase[];
  }, []);

  // Approve legal case
  const approveLegalCase = useCallback(async (caseId: string, notes: string) => {
    if (!user) return false;
    
    setIsLoading(true);
    
    const { error } = await supabase
      .from('legal_review_cases')
      .update({
        status: 'approved',
        reviewer_notes: notes,
        reviewed_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
      })
      .eq('id', caseId);
    
    setIsLoading(false);
    
    if (error) {
      console.error('Error approving case:', error);
      toast.error('Failed to approve case');
      return false;
    }
    
    toast.success('Case approved');
    return true;
  }, [user]);

  // Reject legal case
  const rejectLegalCase = useCallback(async (caseId: string, reason: string) => {
    if (!user) return false;
    
    setIsLoading(true);
    
    const { error } = await supabase
      .from('legal_review_cases')
      .update({
        status: 'rejected',
        decision_reason: reason,
        reviewed_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
      })
      .eq('id', caseId);
    
    setIsLoading(false);
    
    if (error) {
      console.error('Error rejecting case:', error);
      toast.error('Failed to reject case');
      return false;
    }
    
    toast.success('Case rejected');
    return true;
  }, [user]);

  // Check if user is verified for role
  const isUserVerified = useCallback(async (role: AppRole) => {
    if (!user) return false;
    
    const { data } = await supabase
      .from('verification_records')
      .select('is_activated')
      .eq('user_id', user.id)
      .eq('role', role)
      .maybeSingle();
    
    return data?.is_activated ?? false;
  }, [user]);

  // Get user's penalty level
  const getUserPenaltyLevel = useCallback(async () => {
    if (!user) return 0;
    
    const { data } = await supabase.rpc('get_user_penalty_level', {
      _user_id: user.id,
    });
    
    return data ?? 0;
  }, [user]);

  return {
    isLoading,
    verification,
    penalties,
    legalCases,
    
    // Verification
    fetchVerification,
    acceptRoleClauses,
    submitIdentityVerification,
    isUserVerified,
    
    // Penalties
    fetchPenalties,
    fetchAllPenalties,
    issuePenalty,
    submitAppeal,
    getUserPenaltyLevel,
    
    // Legal Review
    fetchLegalCases,
    approveLegalCase,
    rejectLegalCase,
  };
}
