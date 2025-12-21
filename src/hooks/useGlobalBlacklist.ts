import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type BlacklistEntryType = 'email' | 'phone' | 'device' | 'ip' | 'document' | 'card' | 'wallet';
export type ListType = 'blacklist' | 'whitelist' | 'watchlist';

export interface BlacklistEntry {
  id: string;
  list_type: ListType;
  entry_type: BlacklistEntryType;
  entry_value: string; // hashed value
  reason: string | null;
  added_by: string | null;
  created_at: string;
  expires_at: string | null;
  is_active: boolean;
  metadata: {
    original_hint?: string; // e.g., "j***@email.com"
    risk_score?: number;
    source?: string;
    auto_added?: boolean;
  };
}

export interface RiskCheckResult {
  is_blocked: boolean;
  is_watched: boolean;
  is_whitelisted: boolean;
  risk_level: 'safe' | 'watch' | 'high_risk' | 'blocked';
  risk_score: number;
  factors: string[];
  recommended_action: string;
}

export interface UserRiskCard {
  user_id: string;
  email_hint: string;
  phone_hint: string;
  risk_score: number;
  risk_level: 'safe' | 'watch' | 'high_risk' | 'blocked';
  device_count: number;
  ip_locations: string[];
  blacklist_matches: number;
  whitelist_status: boolean;
  payment_history: {
    disputes: number;
    chargebacks: number;
    refunds: number;
  };
  behavior_flags: string[];
  last_activity: string;
}

// Hash function for client-side (for search purposes)
async function hashValue(value: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(value.toLowerCase().trim());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function useGlobalBlacklist() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<BlacklistEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<BlacklistEntry[]>([]);

  // Search blacklist by hashed value
  const searchBlacklist = useCallback(async (
    value: string,
    entryType?: BlacklistEntryType
  ) => {
    setIsLoading(true);
    try {
      const hashedValue = await hashValue(value);
      
      let query = supabase
        .from('access_lists')
        .select('*')
        .eq('entry_value', hashedValue)
        .eq('is_active', true);
      
      if (entryType) {
        query = query.eq('entry_type', entryType);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      const typedData = (data || []) as unknown as BlacklistEntry[];
      setSearchResults(typedData);
      return typedData;
    } catch (error) {
      console.error('Failed to search blacklist:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Add to blacklist
  const addToBlacklist = useCallback(async (
    value: string,
    entryType: BlacklistEntryType,
    reason: string,
    expiresAt?: string,
    metadata?: Record<string, unknown>
  ) => {
    if (!user) return null;

    try {
      const hashedValue = await hashValue(value);
      
      // Create hint (mask the value)
      let hint = '';
      if (entryType === 'email') {
        const [local, domain] = value.split('@');
        hint = `${local.slice(0, 2)}***@${domain}`;
      } else if (entryType === 'phone') {
        hint = `***${value.slice(-4)}`;
      } else {
        hint = `${value.slice(0, 4)}***`;
      }

      const { data, error } = await supabase
        .from('access_lists')
        .insert({
          list_type: 'blacklist',
          entry_type: entryType,
          entry_value: hashedValue,
          reason,
          added_by: user.id,
          expires_at: expiresAt,
          metadata: {
            original_hint: hint,
            ...metadata,
          },
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to add to blacklist:', error);
      return null;
    }
  }, [user]);

  // Remove from blacklist
  const removeFromBlacklist = useCallback(async (entryId: string) => {
    try {
      const { error } = await supabase
        .from('access_lists')
        .update({ is_active: false })
        .eq('id', entryId);

      if (error) throw error;
      setEntries(prev => prev.filter(e => e.id !== entryId));
      return true;
    } catch (error) {
      console.error('Failed to remove from blacklist:', error);
      return false;
    }
  }, []);

  // Add to whitelist (override)
  const addToWhitelist = useCallback(async (
    value: string,
    entryType: BlacklistEntryType,
    reason: string
  ) => {
    if (!user) return null;

    try {
      const hashedValue = await hashValue(value);

      const { data, error } = await supabase
        .from('access_lists')
        .insert({
          list_type: 'whitelist',
          entry_type: entryType,
          entry_value: hashedValue,
          reason,
          added_by: user.id,
          metadata: { source: 'manual_override' },
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to add to whitelist:', error);
      return null;
    }
  }, [user]);

  // Fetch all blacklist entries
  const fetchBlacklistEntries = useCallback(async (
    listType?: ListType,
    limit = 100
  ) => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('access_lists')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (listType) {
        query = query.eq('list_type', listType);
      }

      const { data, error } = await query;

      if (error) throw error;
      const typedData = (data || []) as unknown as BlacklistEntry[];
      setEntries(typedData);
      return typedData;
    } catch (error) {
      console.error('Failed to fetch blacklist entries:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Risk check for a user (combines multiple signals)
  const performRiskCheck = useCallback(async (
    userId: string,
    email?: string,
    phone?: string,
    deviceFingerprint?: string,
    ipAddress?: string
  ): Promise<RiskCheckResult> => {
    try {
      const checks: Promise<BlacklistEntry[]>[] = [];
      
      if (email) checks.push(searchBlacklist(email, 'email'));
      if (phone) checks.push(searchBlacklist(phone, 'phone'));
      if (deviceFingerprint) checks.push(searchBlacklist(deviceFingerprint, 'device'));
      if (ipAddress) checks.push(searchBlacklist(ipAddress, 'ip'));

      const results = await Promise.all(checks);
      const allMatches = results.flat();

      const blacklistMatches = allMatches.filter(e => e.list_type === 'blacklist');
      const whitelistMatches = allMatches.filter(e => e.list_type === 'whitelist');

      // Whitelisted overrides blacklist
      if (whitelistMatches.length > 0) {
        return {
          is_blocked: false,
          is_watched: false,
          is_whitelisted: true,
          risk_level: 'safe',
          risk_score: 0,
          factors: ['Whitelisted user'],
          recommended_action: 'Allow full access',
        };
      }

      // Calculate risk based on blacklist matches
      const riskScore = Math.min(blacklistMatches.length * 25 + 50, 100);
      
      if (blacklistMatches.length > 0) {
        const factors = blacklistMatches.map(m => 
          `Blacklisted ${m.entry_type}: ${m.reason || 'No reason provided'}`
        );

        return {
          is_blocked: riskScore > 80,
          is_watched: riskScore > 30 && riskScore <= 80,
          is_whitelisted: false,
          risk_level: riskScore > 80 ? 'blocked' : riskScore > 60 ? 'high_risk' : 'watch',
          risk_score: riskScore,
          factors,
          recommended_action: riskScore > 80 
            ? 'Block access and notify admin' 
            : 'Monitor activity closely',
        };
      }

      return {
        is_blocked: false,
        is_watched: false,
        is_whitelisted: false,
        risk_level: 'safe',
        risk_score: 0,
        factors: [],
        recommended_action: 'Allow normal access',
      };
    } catch (error) {
      console.error('Risk check failed:', error);
      return {
        is_blocked: false,
        is_watched: true,
        is_whitelisted: false,
        risk_level: 'watch',
        risk_score: 50,
        factors: ['Risk check failed - defaulting to watch mode'],
        recommended_action: 'Monitor with caution',
      };
    }
  }, [searchBlacklist]);

  // Freeze account (auto-action for score > 80)
  const freezeAccount = useCallback(async (
    userId: string,
    reason: string
  ) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('account_suspensions')
        .insert({
          user_id: userId,
          suspension_type: 'risk_auto_freeze',
          reason,
          masked_reason: 'Account flagged for security review',
          auto_triggered: true,
          severity: 'critical',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to freeze account:', error);
      return null;
    }
  }, [user]);

  // Get user risk card (consolidated view)
  const getUserRiskCard = useCallback(async (userId: string): Promise<UserRiskCard | null> => {
    try {
      // Fetch risk score
      const { data: riskData } = await supabase
        .from('risk_scores')
        .select('*')
        .eq('user_id', userId)
        .single();

      // Fetch device fingerprints
      const { data: devices } = await supabase
        .from('device_fingerprints')
        .select('*')
        .eq('user_id', userId);

      // Fetch login locations
      const { data: locations } = await supabase
        .from('login_locations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      // Get blacklist matches count
      const deviceHashes = devices?.map(d => d.fingerprint_hash) || [];
      let blacklistCount = 0;

      for (const hash of deviceHashes) {
        const { count } = await supabase
          .from('access_lists')
          .select('*', { count: 'exact', head: true })
          .eq('entry_value', hash)
          .eq('list_type', 'blacklist')
          .eq('is_active', true);
        
        blacklistCount += count || 0;
      }

      const score = riskData?.current_score || 0;
      let riskLevel: 'safe' | 'watch' | 'high_risk' | 'blocked' = 'safe';
      if (score > 80) riskLevel = 'blocked';
      else if (score > 60) riskLevel = 'high_risk';
      else if (score > 30) riskLevel = 'watch';

      const factors = riskData?.factors;
      const behaviorFlags: string[] = Array.isArray(factors) ? factors.filter((f): f is string => typeof f === 'string') : [];

      return {
        user_id: userId,
        email_hint: '***@***.com',
        phone_hint: '***',
        risk_score: score,
        risk_level: riskLevel,
        device_count: devices?.length || 0,
        ip_locations: locations?.map(l => `${l.city}, ${l.country_code}`) || [],
        blacklist_matches: blacklistCount,
        whitelist_status: false,
        payment_history: {
          disputes: 0,
          chargebacks: 0,
          refunds: 0,
        },
        behavior_flags: behaviorFlags,
        last_activity: locations?.[0]?.created_at || new Date().toISOString(),
      };
    } catch (error) {
      console.error('Failed to get user risk card:', error);
      return null;
    }
  }, []);

  return {
    entries,
    searchResults,
    isLoading,
    searchBlacklist,
    addToBlacklist,
    removeFromBlacklist,
    addToWhitelist,
    fetchBlacklistEntries,
    performRiskCheck,
    freezeAccount,
    getUserRiskCard,
    hashValue,
  };
}

// Risk level badge colors
export const getRiskBadgeColor = (level: 'safe' | 'watch' | 'high_risk' | 'blocked') => {
  switch (level) {
    case 'safe': return 'bg-green-500/10 text-green-500 border-green-500/20';
    case 'watch': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    case 'high_risk': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
    case 'blocked': return 'bg-red-500/10 text-red-500 border-red-500/20';
    default: return 'bg-muted text-muted-foreground';
  }
};
