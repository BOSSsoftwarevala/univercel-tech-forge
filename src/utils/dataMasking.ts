/**
 * Data Masking Utilities for Role Isolation
 * Ensures sensitive data is masked based on role permissions
 */

type MaskType = 'full' | 'partial' | 'email' | 'phone' | 'name';

/**
 * Mask sensitive text based on type
 */
export const maskData = (input: string | null | undefined, type: MaskType = 'partial'): string => {
  if (!input || input.trim() === '') return '***';

  switch (type) {
    case 'full':
      return '********';
    
    case 'partial':
      if (input.length <= 4) return '****';
      return input.substring(0, 2) + '****' + input.substring(input.length - 1);
    
    case 'email':
      const [username, domain] = input.split('@');
      if (!domain) return '***@***.***';
      const maskedUsername = username.length > 2 
        ? username.substring(0, 2) + '***' 
        : '***';
      return `${maskedUsername}@***.***`;
    
    case 'phone':
      if (input.length < 4) return '****';
      return input.substring(0, 3) + '****' + input.substring(input.length - 2);
    
    case 'name':
      const parts = input.split(' ');
      return parts.map(part => 
        part.length > 1 ? part[0] + '***' : '***'
      ).join(' ');
    
    default:
      return '***';
  }
};

/**
 * Role hierarchy for determining data visibility
 */
const roleHierarchy: Record<string, number> = {
  'boss_owner': 110, // Supreme authority - sees everything
  'admin': 90,
  'ceo': 85,
  'area_manager': 80,
  'finance_manager': 75,
  'franchise': 60,
  'reseller': 50,
  'influencer': 40,
  'developer': 35,
  'prime_user': 30,
  'prime': 30,
  'client': 20,
  'user': 10,
};

/**
 * Fields that should be masked for each role level
 */
const maskedFieldsByLevel: Record<number, string[]> = {
  110: [], // Boss owner sees everything
  90: [], // Admin sees everything
  85: ['address'], // CEO - only address masked
  80: ['phone', 'address'], // Area manager
  75: ['email', 'phone', 'address'], // Finance manager
  60: ['email', 'phone', 'full_name', 'address'], // Franchise
  50: ['email', 'phone', 'full_name', 'address'], // Reseller
  40: ['email', 'phone', 'full_name', 'address', 'company'], // Influencer
  35: ['email', 'phone', 'full_name', 'address', 'company'], // Developer
  30: ['email', 'phone', 'full_name', 'address', 'company'], // Prime user
  20: ['email', 'phone', 'full_name', 'address', 'company'], // Client
  10: ['email', 'phone', 'full_name', 'address', 'company'], // User
};

/**
 * Check if a field should be masked for a given role
 */
export const shouldMaskField = (viewerRole: string, fieldName: string): boolean => {
  const level = roleHierarchy[viewerRole] || 10;
  const maskedFields = maskedFieldsByLevel[level] || maskedFieldsByLevel[10];
  return maskedFields.includes(fieldName.toLowerCase());
};

/**
 * Mask an object's sensitive fields based on viewer role
 */
export const maskObjectForRole = (
  data: Record<string, any>,
  viewerRole: string
): Record<string, any> => {
  const result = { ...data };
  
  const fieldMaskTypes: Record<string, MaskType> = {
    email: 'email',
    phone: 'phone',
    full_name: 'name',
    first_name: 'name',
    last_name: 'name',
    address: 'full',
    company: 'partial',
  };

  for (const key of Object.keys(result)) {
    if (shouldMaskField(viewerRole, key) && result[key]) {
      const maskType = fieldMaskTypes[key.toLowerCase()] || 'partial';
      result[key] = maskData(String(result[key]), maskType);
    }
  }

  return result;
};

/**
 * Check if one role can view another role's data
 */
export const canViewRoleData = (viewerRole: string, targetRole: string): boolean => {
  const viewerLevel = roleHierarchy[viewerRole] || 10;
  const targetLevel = roleHierarchy[targetRole] || 10;
  
  // Can only view lower or equal level roles
  return viewerLevel >= targetLevel;
};

/**
 * Get display name with masking based on role
 */
export const getDisplayName = (
  fullName: string | null | undefined,
  viewerRole: string
): string => {
  if (!fullName) return 'Anonymous User';
  
  if (shouldMaskField(viewerRole, 'full_name')) {
    return maskData(fullName, 'name');
  }
  
  return fullName;
};

/**
 * Generate a masked reference ID for leads/users
 */
export const generateMaskedId = (originalId: string): string => {
  if (!originalId || originalId.length < 8) return 'REF-****';
  return `REF-${originalId.substring(0, 4).toUpperCase()}***`;
};
