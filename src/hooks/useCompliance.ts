import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface ConsentStatus {
  privacy_policy: boolean;
  terms_of_service: boolean;
  marketing: boolean;
  cookies: boolean;
  data_processing: boolean;
}

interface DataResidency {
  region_code: string;
  storage_location: string;
  applicable_regulations: string[];
  cross_border_allowed: boolean;
}

interface ComplianceRequirement {
  requirement_type: string;
  requirement_name: string;
  description: string;
  is_mandatory: boolean;
}

export function useCompliance() {
  const { user } = useAuth();
  const [consents, setConsents] = useState<ConsentStatus>({
    privacy_policy: false,
    terms_of_service: false,
    marketing: false,
    cookies: false,
    data_processing: false,
  });
  const [dataResidency, setDataResidency] = useState<DataResidency | null>(null);
  const [requirements, setRequirements] = useState<ComplianceRequirement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchConsents = useCallback(async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('user_consents')
      .select('consent_type, is_granted')
      .eq('user_id', user.id);

    if (data) {
      const consentMap = data.reduce((acc, c) => {
        acc[c.consent_type as keyof ConsentStatus] = c.is_granted;
        return acc;
      }, {} as ConsentStatus);
      setConsents(prev => ({ ...prev, ...consentMap }));
    }
  }, [user]);

  const grantConsent = useCallback(async (
    consentType: keyof ConsentStatus,
    version: string = '1.0',
    ipAddress?: string
  ) => {
    if (!user) return false;

    const { error } = await supabase
      .from('user_consents')
      .upsert({
        user_id: user.id,
        consent_type: consentType,
        consent_version: version,
        is_granted: true,
        granted_at: new Date().toISOString(),
        ip_address: ipAddress,
      }, { onConflict: 'user_id,consent_type,consent_version' });

    if (!error) {
      setConsents(prev => ({ ...prev, [consentType]: true }));
      return true;
    }
    return false;
  }, [user]);

  const revokeConsent = useCallback(async (consentType: keyof ConsentStatus) => {
    if (!user) return false;

    const { error } = await supabase
      .from('user_consents')
      .update({ 
        is_granted: false, 
        revoked_at: new Date().toISOString() 
      })
      .eq('user_id', user.id)
      .eq('consent_type', consentType);

    if (!error) {
      setConsents(prev => ({ ...prev, [consentType]: false }));
      return true;
    }
    return false;
  }, [user]);

  const requestDataExport = useCallback(async (categories: string[] = ['all']) => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('data_subject_requests')
      .insert({
        user_id: user.id,
        request_type: 'export',
        regulation: 'GDPR',
        requested_data_categories: categories,
        deadline_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select()
      .single();

    return error ? null : data;
  }, [user]);

  const requestDataDeletion = useCallback(async (reason?: string) => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('data_subject_requests')
      .insert({
        user_id: user.id,
        request_type: 'deletion',
        regulation: 'GDPR',
        requested_data_categories: ['all'],
        notes: reason,
        deadline_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select()
      .single();

    return error ? null : data;
  }, [user]);

  const fetchDataResidency = useCallback(async (regionCode: string) => {
    const { data } = await supabase
      .from('data_residency_config')
      .select('*')
      .eq('region_code', regionCode)
      .single();

    if (data) setDataResidency(data as DataResidency);
  }, []);

  const fetchRequirements = useCallback(async (regionCode: string) => {
    const { data } = await supabase
      .from('regional_compliance_requirements')
      .select('*')
      .eq('region_code', regionCode)
      .eq('is_active', true);

    if (data) setRequirements(data as ComplianceRequirement[]);
  }, []);

  const calculateTax = useCallback(async (
    countryCode: string,
    stateCode: string | null,
    amount: number,
    category: string = 'products'
  ) => {
    const { data } = await supabase.rpc('calculate_regional_tax', {
      p_country_code: countryCode,
      p_state_code: stateCode,
      p_amount: amount,
      p_category: category,
    });
    return data;
  }, []);

  const hasRequiredConsents = useCallback(() => {
    return consents.privacy_policy && consents.terms_of_service;
  }, [consents]);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      await fetchConsents();
      setIsLoading(false);
    };
    if (user) load();
  }, [user, fetchConsents]);

  return {
    consents,
    dataResidency,
    requirements,
    isLoading,
    grantConsent,
    revokeConsent,
    requestDataExport,
    requestDataDeletion,
    fetchDataResidency,
    fetchRequirements,
    calculateTax,
    hasRequiredConsents,
    refetch: fetchConsents,
  };
}
