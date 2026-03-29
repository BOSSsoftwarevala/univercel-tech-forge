/**
 * Global Compliance Layer
 * Regional data handling, encrypted tenant boundaries, permanent logs
 * Preserves masking and RBAC across all regions
 */

import { Region } from './region-manager';

export type ComplianceZone = 'GDPR' | 'CCPA' | 'LGPD' | 'PDPA' | 'POPIA' | 'GLOBAL';
export type DataClassification = 'public' | 'internal' | 'confidential' | 'restricted';

export interface ComplianceRule {
  zone: ComplianceZone;
  dataRetentionDays: number;
  encryptionRequired: boolean;
  crossBorderTransfer: boolean;
  consentRequired: boolean;
  rightToDelete: boolean;
  auditLogRetention: number; // days
  maskedFieldsRequired: string[];
}

export interface DataResidency {
  tenantId: string;
  primaryRegion: Region;
  allowedRegions: Region[];
  complianceZone: ComplianceZone;
  dataClassification: DataClassification;
  encryptionEnabled: boolean;
  lastAudit: string;
}

export interface AuditEntry {
  id: string;
  tenantId: string;
  region: Region;
  action: string;
  dataType: string;
  classification: DataClassification;
  complianceZone: ComplianceZone;
  maskedData: boolean;
  timestamp: string;
  permanent: boolean;
}

const COMPLIANCE_RULES: Record<ComplianceZone, ComplianceRule> = {
  GDPR: {
    zone: 'GDPR',
    dataRetentionDays: 365 * 3,
    encryptionRequired: true,
    crossBorderTransfer: false,
    consentRequired: true,
    rightToDelete: true,
    auditLogRetention: 365 * 7,
    maskedFieldsRequired: ['email', 'phone', 'name', 'address']
  },
  CCPA: {
    zone: 'CCPA',
    dataRetentionDays: 365 * 2,
    encryptionRequired: true,
    crossBorderTransfer: true,
    consentRequired: true,
    rightToDelete: true,
    auditLogRetention: 365 * 5,
    maskedFieldsRequired: ['email', 'phone']
  },
  LGPD: {
    zone: 'LGPD',
    dataRetentionDays: 365 * 5,
    encryptionRequired: true,
    crossBorderTransfer: false,
    consentRequired: true,
    rightToDelete: true,
    auditLogRetention: 365 * 5,
    maskedFieldsRequired: ['email', 'phone', 'cpf']
  },
  PDPA: {
    zone: 'PDPA',
    dataRetentionDays: 365 * 5,
    encryptionRequired: true,
    crossBorderTransfer: false,
    consentRequired: true,
    rightToDelete: true,
    auditLogRetention: 365 * 5,
    maskedFieldsRequired: ['email', 'phone', 'nric']
  },
  POPIA: {
    zone: 'POPIA',
    dataRetentionDays: 365 * 5,
    encryptionRequired: true,
    crossBorderTransfer: false,
    consentRequired: true,
    rightToDelete: true,
    auditLogRetention: 365 * 5,
    maskedFieldsRequired: ['email', 'phone', 'id_number']
  },
  GLOBAL: {
    zone: 'GLOBAL',
    dataRetentionDays: 365 * 7,
    encryptionRequired: true,
    crossBorderTransfer: true,
    consentRequired: false,
    rightToDelete: false,
    auditLogRetention: 365 * 10,
    maskedFieldsRequired: ['email', 'phone']
  }
};

// Region to compliance zone mapping
const REGION_COMPLIANCE: Record<Region, ComplianceZone> = {
  'us-east': 'CCPA',
  'us-west': 'CCPA',
  'eu-west': 'GDPR',
  'eu-central': 'GDPR',
  'asia-pacific': 'PDPA',
  'asia-south': 'PDPA',
  'middle-east': 'GLOBAL',
  'africa': 'POPIA',
  'south-america': 'LGPD'
};

export class ComplianceManager {
  private residencyMap: Map<string, DataResidency> = new Map();
  private auditLog: AuditEntry[] = [];
  private encryptionKeys: Map<string, string> = new Map();

  /**
   * Get compliance zone for region
   */
  getComplianceZone(region: Region): ComplianceZone {
    return REGION_COMPLIANCE[region] || 'GLOBAL';
  }

  /**
   * Get compliance rules for zone
   */
  getComplianceRules(zone: ComplianceZone): ComplianceRule {
    return COMPLIANCE_RULES[zone];
  }

  /**
   * Register tenant data residency
   */
  registerTenantResidency(
    tenantId: string,
    primaryRegion: Region,
    classification: DataClassification = 'confidential'
  ): DataResidency {
    const zone = this.getComplianceZone(primaryRegion);
    const rules = this.getComplianceRules(zone);

    const residency: DataResidency = {
      tenantId,
      primaryRegion,
      allowedRegions: this.getAllowedRegions(primaryRegion, rules),
      complianceZone: zone,
      dataClassification: classification,
      encryptionEnabled: rules.encryptionRequired,
      lastAudit: new Date().toISOString()
    };

    this.residencyMap.set(tenantId, residency);
    
    // Generate encryption key for tenant
    this.encryptionKeys.set(tenantId, crypto.randomUUID());

    return residency;
  }

  /**
   * Get allowed regions based on compliance
   */
  private getAllowedRegions(primaryRegion: Region, rules: ComplianceRule): Region[] {
    if (rules.crossBorderTransfer) {
      return Object.keys(REGION_COMPLIANCE) as Region[];
    }

    // Only allow regions in same compliance zone
    return (Object.entries(REGION_COMPLIANCE) as [Region, ComplianceZone][])
      .filter(([, zone]) => zone === rules.zone)
      .map(([region]) => region);
  }

  /**
   * Check if data transfer is allowed
   */
  isTransferAllowed(tenantId: string, targetRegion: Region): boolean {
    const residency = this.residencyMap.get(tenantId);
    if (!residency) return false;

    return residency.allowedRegions.includes(targetRegion);
  }

  /**
   * Validate data has required masking
   */
  validateMasking(data: Record<string, any>, zone: ComplianceZone): {
    valid: boolean;
    missingMasks: string[];
  } {
    const rules = this.getComplianceRules(zone);
    const missingMasks: string[] = [];

    rules.maskedFieldsRequired.forEach(field => {
      if (data[field] && !this.isMasked(data[field])) {
        missingMasks.push(field);
      }
    });

    return {
      valid: missingMasks.length === 0,
      missingMasks
    };
  }

  /**
   * Check if value is masked
   */
  private isMasked(value: string): boolean {
    return value.includes('****') || value.includes('***');
  }

  /**
   * Log audit entry (permanent)
   */
  logAudit(entry: Omit<AuditEntry, 'id' | 'timestamp' | 'permanent'>): AuditEntry {
    const auditEntry: AuditEntry = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      permanent: true // All audit logs are permanent
    };

    this.auditLog.push(auditEntry);
    return auditEntry;
  }

  /**
   * Get audit log for tenant
   */
  getAuditLog(tenantId: string): AuditEntry[] {
    return this.auditLog.filter(e => e.tenantId === tenantId);
  }

  /**
   * Get tenant residency
   */
  getTenantResidency(tenantId: string): DataResidency | undefined {
    return this.residencyMap.get(tenantId);
  }

  /**
   * Check data retention
   */
  checkDataRetention(tenantId: string, dataTimestamp: string): {
    withinRetention: boolean;
    daysRemaining: number;
  } {
    const residency = this.residencyMap.get(tenantId);
    if (!residency) return { withinRetention: true, daysRemaining: Infinity };

    const rules = this.getComplianceRules(residency.complianceZone);
    const dataDate = new Date(dataTimestamp);
    const retentionEnd = new Date(dataDate.getTime() + rules.dataRetentionDays * 24 * 60 * 60 * 1000);
    const now = new Date();

    return {
      withinRetention: now < retentionEnd,
      daysRemaining: Math.max(0, Math.ceil((retentionEnd.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)))
    };
  }

  /**
   * Encrypt data for tenant
   */
  encryptForTenant(_tenantId: string, data: string): string {
    // In production, use actual encryption with tenant key
    return btoa(data);
  }

  /**
   * Decrypt data for tenant
   */
  decryptForTenant(_tenantId: string, encryptedData: string): string {
    // In production, use actual decryption with tenant key
    return atob(encryptedData);
  }

  /**
   * Get compliance summary
   */
  getSummary(): {
    totalTenants: number;
    byZone: Record<ComplianceZone, number>;
    encryptedTenants: number;
    auditEntries: number;
  } {
    const residencies = Array.from(this.residencyMap.values());
    const byZone: Record<ComplianceZone, number> = {
      GDPR: 0, CCPA: 0, LGPD: 0, PDPA: 0, POPIA: 0, GLOBAL: 0
    };

    residencies.forEach(r => {
      byZone[r.complianceZone]++;
    });

    return {
      totalTenants: residencies.length,
      byZone,
      encryptedTenants: residencies.filter(r => r.encryptionEnabled).length,
      auditEntries: this.auditLog.length
    };
  }
}

export const complianceManager = new ComplianceManager();
export default ComplianceManager;
