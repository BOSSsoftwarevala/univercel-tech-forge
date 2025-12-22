// ==============================================
// Identity Masking Engine
// ==============================================
// This module handles all identity masking logic
// to prevent exposure of real names, emails, phones.

import { MASKED_ID_CONFIG, generateMaskedId, AppRole } from './rbac';
import * as LucideIcons from 'lucide-react';
import React from 'react';

// Country data with flags
export const COUNTRIES: Record<string, { flag: string; name: string; locale: string }> = {
  'IN': { flag: '🇮🇳', name: 'India', locale: 'en-IN' },
  'US': { flag: '🇺🇸', name: 'USA', locale: 'en-US' },
  'UK': { flag: '🇬🇧', name: 'UK', locale: 'en-GB' },
  'AE': { flag: '🇦🇪', name: 'UAE', locale: 'ar-AE' },
  'KE': { flag: '🇰🇪', name: 'Kenya', locale: 'en-KE' },
  'NG': { flag: '🇳🇬', name: 'Nigeria', locale: 'en-NG' },
  'SA': { flag: '🇸🇦', name: 'Saudi', locale: 'ar-SA' },
  'SG': { flag: '🇸🇬', name: 'Singapore', locale: 'en-SG' },
  'DE': { flag: '🇩🇪', name: 'Germany', locale: 'de-DE' },
  'FR': { flag: '🇫🇷', name: 'France', locale: 'fr-FR' },
  'JP': { flag: '🇯🇵', name: 'Japan', locale: 'ja-JP' },
  'AU': { flag: '🇦🇺', name: 'Australia', locale: 'en-AU' },
  'CA': { flag: '🇨🇦', name: 'Canada', locale: 'en-CA' },
  'BR': { flag: '🇧🇷', name: 'Brazil', locale: 'pt-BR' },
};

export interface MaskedUser {
  maskedId: string;
  role: string;
  displayRole: string;
  icon: React.ReactNode;
  iconName: string;
  color: string;
  country: string;
  countryCode: string;
  countryFlag: string;
}

// Get random country code
export function getRandomCountryCode(): string {
  const keys = Object.keys(COUNTRIES);
  return keys[Math.floor(Math.random() * keys.length)];
}

// Get icon component by name
export function getIconByName(iconName: string, className = 'w-4 h-4'): React.ReactNode {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Crown: LucideIcons.Crown,
    Shield: LucideIcons.Shield,
    Briefcase: LucideIcons.Briefcase,
    Building2: LucideIcons.Building2,
    ShoppingBag: LucideIcons.ShoppingBag,
    Target: LucideIcons.Target,
    Headphones: LucideIcons.Headphones,
    HeartHandshake: LucideIcons.HeartHandshake,
    Wallet: LucideIcons.Wallet,
    TrendingUp: LucideIcons.TrendingUp,
    Monitor: LucideIcons.Monitor,
    Search: LucideIcons.Search,
    Megaphone: LucideIcons.Megaphone,
    Star: LucideIcons.Star,
    Users: LucideIcons.Users,
    User: LucideIcons.User,
    Bot: LucideIcons.Bot,
    Scale: LucideIcons.Scale,
    UserPlus: LucideIcons.UserPlus,
    Lightbulb: LucideIcons.Lightbulb,
    ListTodo: LucideIcons.ListTodo,
  };

  const IconComponent = iconMap[iconName] || LucideIcons.User;
  return React.createElement(IconComponent, { className });
}

// Role to color mapping
const ROLE_COLORS: Record<string, string> = {
  super_admin: 'text-yellow-500 bg-yellow-500/10',
  admin: 'text-purple-500 bg-purple-500/10',
  developer: 'text-blue-500 bg-blue-500/10',
  task_manager: 'text-purple-500 bg-purple-500/10',
  rnd_manager: 'text-orange-500 bg-orange-500/10',
  hr_manager: 'text-indigo-500 bg-indigo-500/10',
  legal_compliance: 'text-indigo-500 bg-indigo-500/10',
  ai_manager: 'text-cyan-500 bg-cyan-500/10',
  franchise: 'text-emerald-500 bg-emerald-500/10',
  reseller: 'text-orange-500 bg-orange-500/10',
  lead_manager: 'text-pink-500 bg-pink-500/10',
  support: 'text-cyan-500 bg-cyan-500/10',
  client_success: 'text-cyan-500 bg-cyan-500/10',
  finance_manager: 'text-green-500 bg-green-500/10',
  performance_manager: 'text-rose-500 bg-rose-500/10',
  demo_manager: 'text-violet-500 bg-violet-500/10',
  seo_manager: 'text-teal-500 bg-teal-500/10',
  marketing_manager: 'text-fuchsia-500 bg-fuchsia-500/10',
  influencer: 'text-pink-400 bg-pink-400/10',
  prime: 'text-amber-500 bg-amber-500/10',
  client: 'text-gray-500 bg-gray-500/10',
  general: 'text-gray-500 bg-gray-500/10',
  guest: 'text-gray-500 bg-gray-500/10',
  common: 'text-slate-400 bg-slate-500/10',
};

// Generate complete masked user object
export function createMaskedUser(role: AppRole | string, userId: string, countryCode?: string): MaskedUser {
  const { maskedId, config } = generateMaskedId(role, userId);
  const country = countryCode || getRandomCountryCode();
  const countryData = COUNTRIES[country] || COUNTRIES['IN'];
  
  return {
    maskedId,
    role,
    displayRole: config.displayName,
    icon: getIconByName(config.icon),
    iconName: config.icon,
    color: ROLE_COLORS[role] || ROLE_COLORS.common,
    country: countryData.name,
    countryCode: country,
    countryFlag: countryData.flag,
  };
}

// Mask email address (e.g., jo***@example.com)
export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return '***@***.***';
  const [local, domain] = email.split('@');
  if (local.length <= 2) return `${local}***@${domain}`;
  return `${local.slice(0, 2)}***@${domain}`;
}

// Mask phone number (e.g., +91***7890)
export function maskPhone(phone: string): string {
  if (!phone || phone.length < 6) return '***';
  return `${phone.slice(0, 3)}****${phone.slice(-4)}`;
}

// Mask name (e.g., John D***)
export function maskName(name: string): string {
  if (!name || name.length < 2) return '***';
  const parts = name.split(' ');
  if (parts.length === 1) {
    return `${name.slice(0, 2)}***`;
  }
  return `${parts[0]} ${parts[1]?.slice(0, 1) || ''}***`;
}

// Check if a string contains a masked ID pattern
export function containsMaskedId(text: string): boolean {
  const patterns = [
    /👑\s*BOSS-\d{2}/,
    /⭐\s*PRM-\d{7}/,
    /MGT-\d{2}/,
    /EMP-\d{3}/,
    /FRN-\d{4}/,
    /RSL-\d{5}/,
    /SLS-\d{5}/,
    /SUP-\d{5}/,
    /FIN-\d{5}/,
    /PFM-\d{5}/,
    /DMO-\d{5}/,
    /SEO-\d{5}/,
    /MKT-\d{5}/,
    /INF-\d{5}/,
    /GEN-\d{6}/,
    /USR-\d{8}/,
  ];
  return patterns.some(pattern => pattern.test(text));
}

// Preserve masked IDs during translation
export function preserveMaskedIds(text: string): { cleanText: string; maskedIds: string[] } {
  const maskedIds: string[] = [];
  const patterns = [
    /👑\s*BOSS-\d{2}/g,
    /⭐\s*PRM-\d{7}/g,
    /MGT-\d{2}/g,
    /EMP-\d{3}/g,
    /FRN-\d{4}/g,
    /RSL-\d{5}/g,
    /SLS-\d{5}/g,
    /SUP-\d{5}/g,
    /FIN-\d{5}/g,
    /PFM-\d{5}/g,
    /DMO-\d{5}/g,
    /SEO-\d{5}/g,
    /MKT-\d{5}/g,
    /INF-\d{5}/g,
    /GEN-\d{6}/g,
    /USR-\d{8}/g,
  ];
  
  let cleanText = text;
  patterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      maskedIds.push(...matches);
      matches.forEach((match, index) => {
        cleanText = cleanText.replace(match, `__MASKED_ID_${maskedIds.length - matches.length + index}__`);
      });
    }
  });
  
  return { cleanText, maskedIds };
}

// Restore masked IDs after translation
export function restoreMaskedIds(text: string, maskedIds: string[]): string {
  let result = text;
  maskedIds.forEach((id, index) => {
    result = result.replace(`__MASKED_ID_${index}__`, id);
  });
  return result;
}

// Full data masking for sensitive objects
export function maskSensitiveData(data: Record<string, any>, role: AppRole | string): Record<string, any> {
  // Super admin and admin see full data
  if (role === 'super_admin' || role === 'admin') {
    return data;
  }

  const masked = { ...data };
  
  // Mask sensitive fields
  if (masked.email) masked.masked_email = maskEmail(masked.email);
  if (masked.phone) masked.masked_phone = maskPhone(masked.phone);
  if (masked.full_name) masked.masked_name = maskName(masked.full_name);
  if (masked.owner_name) masked.masked_owner = maskName(masked.owner_name);
  if (masked.contact_name) masked.masked_contact = maskName(masked.contact_name);
  if (masked.contact_phone) masked.masked_contact_phone = maskPhone(masked.contact_phone);
  if (masked.contact_email) masked.masked_contact_email = maskEmail(masked.contact_email);
  
  // Remove original sensitive fields for non-admin roles
  if (role !== 'super_admin' && role !== 'admin' && role !== 'finance_manager') {
    delete masked.email;
    delete masked.phone;
    delete masked.full_name;
    delete masked.owner_name;
    delete masked.contact_name;
    delete masked.contact_phone;
    delete masked.contact_email;
    delete masked.pan_number;
    delete masked.gst_number;
    delete masked.bank_details;
  }

  return masked;
}
