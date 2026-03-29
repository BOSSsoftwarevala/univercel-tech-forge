import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Key,
  Plus,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Copy,
  RefreshCw,
  AlertTriangle,
  Download,
  Eye,
  TrendingUp,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type LicenseStatus = 'active' | 'expired' | 'suspended' | 'pending';
type LicenseType = 'annual' | 'perpetual';

type License = {
  id: string;
  key: string;
  product: string;
  user: string;
  status: LicenseStatus;
  /**
   * ISO date string. If absent and type is "perpetual", the UI will show "Lifetime".
   */
  expiresAt?: string;
  type: LicenseType;
};

type StatusStyle = {
  bg: string;
  fg: string;
  icon: React.ElementType;
};

const T = {
  glass: 'hsla(222, 47%, 11%, 0.72)',
  glassBorder: 'hsla(215, 40%, 35%, 0.25)',
  text: 'hsl(210, 40%, 98%)',
  muted: 'hsl(215, 22%, 65%)',
  dim: 'hsl(215, 15%, 42%)',
  blue: 'hsl(217, 92%, 65%)',
  green: 'hsl(160, 84%, 44%)',
  amber: 'hsl(38, 95%, 55%)',
  red: 'hsl(346, 82%, 55%)',
  purple: 'hsl(262, 85%, 63%)',
  rowHover: 'hsla(217, 91%, 60%, 0.07)',
} as const;

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
} as const;

const rise = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 400, damping: 28 },
  },
} as const;

function formatDate(value?: string): string {
  if (!value) return 'Lifetime';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return 'Lifetime';
  return d.toLocaleDateString();
}

function normalizeStatus(status: unknown): LicenseStatus {
  switch (String(status)) {
    case 'active':
    case 'expired':
    case 'suspended':
    case 'pending':
      return String(status) as LicenseStatus;
    default:
      return 'pending';
  }
}

/**
 * Map rows from `api_keys` (or any similar shape) into the License UI model.
 * We keep this defensive to prevent runtime / build-time typing issues.
 */
function toLicenseRow(row: Record<string, unknown>): License {
  const id = String(row.id ?? row.key ?? row.license_key ?? crypto.randomUUID());
  const key = String(row.key ?? row.license_key ?? row.id ?? id);
  const product = String(row.product ?? 'Software License');
  const user = String(row.user ?? row.user_id ?? 'User');
  const status = normalizeStatus(row.status);
  const expiresAtRaw = row.expiresAt ?? row.expires_at;
  const expiresAt = typeof expiresAtRaw === 'string' ? expiresAtRaw : undefined;

  // Default to "annual" unless clearly perpetual/lifetime-like.
  const typeRaw = String(row.type ?? '');
  const type: LicenseType =
    typeRaw === 'perpetual' || typeRaw === 'lifetime' ? 'perpetual' : 'annual';

  return {
    id,
    key,
    product,
    user,
    status,
    expiresAt,
    type,
  };
}

const Glass = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <motion.div
    variants={rise}
    className={`rounded-2xl overflow-hidden ${className}`}
    style={{
      background: T.glass,
      backdropFilter: 'blur(20px)',
      border: `1px solid ${T.glassBorder}`,
      boxShadow: `0 8px 32px -8px hsla(222,47%,4%,0.5)`,
    }}
  >
    {children}
  </motion.div>
);

const SectionHeader = ({
  title,
  count,
  icon: Icon,
}: {
  title: string;
  count?: number;
  icon?: React.ElementType;
}) => (
  <div
    className="flex items-center justify-between pb-2.5 mb-3"
    style={{ borderBottom: `1px solid ${T.glassBorder}` }}
  >
    <div className="flex items-center gap-2">
      {Icon ? <Icon className="w-4 h-4" style={{ color: T.blue }} /> : null}
      <h3
        className="text-[13px] font-bold uppercase tracking-wider"
        style={{ color: T.text }}
      >
        {title}
      </h3>
    </div>

    {count !== undefined ? (
      <span
        className="text-[10px] px-2 py-0.5 rounded-full font-bold"
        style={{ background: `${T.blue}18`, color: T.blue }}
      >
        {count}
      </span>
    ) : null}
  </div>
);

export function LicenseManager(): React.ReactElement {
  const [search, setSearch] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<'all' | LicenseStatus>('all');

  // Mock data for local/dev use and as a fallback when the database is empty.
  // NOTE: "perpetual" spelling is correct (not "perpetual").
  const mockLicenses: License[] = [
    {
      id: 'LIC-001',
      key: 'SW-AAAA-BBBB-CCCC',
      product: 'Enterprise Suite',
      user: 'john@example.com',
      status: 'active',
      expiresAt: '2026-12-31',
      type: 'perpetual',
    },
    {
      id: 'LIC-002',
      key: 'SW-DDDD-EEEE-FFFF',
      product: 'Pro Manager',
      user: 'jane@example.com',
      status: 'active',
      expiresAt: '2025-06-30',
      type: 'annual',
    },
    {
      id: 'LIC-003',
      key: 'SW-GGGG-HHHH-IIII',
      product: 'Starter Pack',
      user: 'alice@example.com',
      status: 'expired',
      expiresAt: '2024-12-31',
      type: 'annual',
    },
    {
      id: 'LIC-004',
      key: 'SW-JJJJ-KKKK-LLLL',
      product: 'Enterprise Suite',
      user: 'bob@example.com',
      status: 'active',
      expiresAt: '2027-03-15',
      type: 'perpetual',
    },
    {
      id: 'LIC-005',
      key: 'SW-MMMM-NNNN-OOOO',
      product: 'Pro Manager',
      user: 'charlie@example.com',
      status: 'suspended',
      expiresAt: '2025-09-30',
      type: 'annual',
    },
  ];

  // Use api_keys table as a license proxy.
  const { data: dbRows, isLoading } = useQuery({
    queryKey: ['boss-licenses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);

      if (error) return [] as Record<string, unknown>[];
      return (data ?? []) as Record<string, unknown>[];
    },
    retry: false,
  });

  const { data: stats } = useQuery({
    queryKey: ['boss-license-stats'],
    queryFn: async () => {
      const [activeRes, allRes] = await Promise.all([
        supabase
          .from('api_keys')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'active'),
        supabase.from('api_keys').select('id', { count: 'exact', head: true }),
      ]);

      return {
        total: allRes.count ?? 0,
        active: activeRes.count ?? 0,
        expired: 0,
        revenue: 0,
      };
    },
  });

  const statusConfig: Record<LicenseStatus, StatusStyle> = {
    active: { bg: `${T.green}18`, fg: T.green, icon: CheckCircle },
    expired: { bg: `${T.red}18`, fg: T.red, icon: XCircle },
    suspended: { bg: `${T.amber}18`, fg: T.amber, icon: AlertTriangle },
    pending: { bg: `${T.blue}18`, fg: T.blue, icon: Clock },
  };

  const licenseRows: License[] = useMemo(() => {
    if (dbRows && dbRows.length > 0) return dbRows.map(toLicenseRow);
    return mockLicenses;
  }, [dbRows]);

  const displayLicenses: License[] = useMemo(() => {
    const s = search.trim().toLowerCase();

    return licenseRows.filter((l) => {
      const matchesStatus = filterStatus === 'all' || l.status === filterStatus;

      const matchesSearch =
        s.length === 0 ||
        l.key.toLowerCase().includes(s) ||
        l.product.toLowerCase().includes(s) ||
        l.user.toLowerCase().includes(s);

      return matchesStatus && matchesSearch;
    });
  }, [filterStatus, licenseRows, search]);

  return (
    <motion.div
      className="space-y-5"
      variants={stagger}
      initial="hidden"
      animate="show"
      style={{ color: T.text }}
    >
      {/* Header */}
      <motion.div variants={rise} className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black tracking-tight">License Manager</h1>
          <p className="text-[11px] mt-0.5" style={{ color: T.muted }}>
            Manage software licenses, API keys, and activation codes
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => toast.info('License export coming soon')}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all"
            style={{
              background: 'hsla(215,28%,20%,0.5)',
              color: T.muted,
              border: `1px solid ${T.glassBorder}`,
            }}
          >
            <Download className="w-3.5 h-3.5" /> Export
          </button>

          <button
            type="button"
            onClick={() => toast.info('License generation coming soon')}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all"
            style={{ background: T.blue, color: 'white' }}
          >
            <Plus className="w-3.5 h-3.5" /> Generate License
          </button>
        </div>
      </motion.div>

      {/* KPI */}
      <motion.div variants={stagger} className="grid grid-cols-4 gap-3">
        {[
          {
            label: 'Total Licenses',
            value: stats?.total ?? mockLicenses.length,
            icon: Key,
            color: T.blue,
          },
          {
            label: 'Active',
            value:
              stats?.active ??
              mockLicenses.filter((l) => l.status === 'active').length,
            icon: CheckCircle,
            color: T.green,
          },
          {
            label: 'Expired',
            value:
              stats?.expired ??
              mockLicenses.filter((l) => l.status === 'expired').length,
            icon: XCircle,
            color: T.red,
          },
          { label: 'MRR', value: '$12.4K', icon: TrendingUp, color: T.purple },
        ].map((k) => (
          <Glass key={k.label} className="p-4">
            <k.icon className="w-4 h-4 mb-2" style={{ color: k.color }} />
            <p className="text-2xl font-black">
              {typeof k.value === 'number' ? k.value.toLocaleString() : k.value}
            </p>
            <p
              className="text-[10px] uppercase tracking-wider mt-1"
              style={{ color: T.muted }}
            >
              {k.label}
            </p>
          </Glass>
        ))}
      </motion.div>

      {/* Filter + Search */}
      <motion.div variants={rise} className="flex items-center gap-3">
        <div
          className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{
            background: 'hsla(215,28%,15%,0.8)',
            border: `1px solid ${T.glassBorder}`,
          }}
        >
          <Search className="w-3.5 h-3.5" style={{ color: T.muted }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by key, product, user..."
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: T.text }}
          />
        </div>

        <div
          className="flex gap-1 p-1 rounded-lg"
          style={{
            background: 'hsla(222,47%,9%,0.8)',
            border: `1px solid ${T.glassBorder}`,
          }}
        >
          {(['all', 'active', 'expired', 'suspended'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilterStatus(s)}
              className="px-3 py-1.5 rounded text-[11px] font-semibold capitalize transition-all"
              style={{
                background: filterStatus === s ? T.blue : 'transparent',
                color: filterStatus === s ? 'white' : T.muted,
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </motion.div>

      {/* License Table */}
      <Glass className="p-5">
        <SectionHeader
          title="License Registry"
          count={displayLicenses.length}
          icon={Key}
        />

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw
              className="w-6 h-6 animate-spin"
              style={{ color: T.muted }}
            />
          </div>
        ) : (
          <div
            className="space-y-2 max-h-[500px] overflow-y-auto pr-1"
            style={{ scrollbarWidth: 'thin' }}
          >
            {displayLicenses.map((lic) => {
              const sc = statusConfig[lic.status] ?? statusConfig.pending;
              const StatusIcon = sc.icon;

              return (
                <motion.div
                  key={lic.id}
                  variants={rise}
                  className="flex items-center gap-4 px-3 py-3 rounded-xl transition-colors"
                  whileHover={{ backgroundColor: T.rowHover }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: `${sc.fg}15` }}
                  >
                    <Key className="w-4 h-4" style={{ color: sc.fg }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p
                        className="text-xs font-mono font-bold truncate"
                        style={{ color: T.text }}
                        title={lic.key}
                      >
                        {lic.key}
                      </p>

                      <span
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold"
                        style={{ background: sc.bg, color: sc.fg }}
                      >
                        <StatusIcon className="w-2.5 h-2.5" />
                        {lic.status}
                      </span>
                    </div>

                    <p className="text-[11px]" style={{ color: T.muted }}>
                      {lic.product} • {lic.user}
                    </p>
                  </div>

                  <div className="text-right">
                    <p
                      className="text-[10px] font-mono"
                      style={{ color: T.dim }}
                    >
                      {lic.type === 'perpetual' ? 'Lifetime' : formatDate(lic.expiresAt)}
                    </p>
                    <p
                      className="text-[9px] uppercase tracking-wider"
                      style={{ color: T.dim }}
                    >
                      {lic.type}
                    </p>
                  </div>

                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        void navigator.clipboard.writeText(lic.key);
                        toast.success('License key copied');
                      }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ background: `${T.blue}15`, color: T.blue }}
                      aria-label="Copy license key"
                      title="Copy license key"
                    >
                      <Copy className="w-3 h-3" />
                    </button>

                    <button
                      type="button"
                      onClick={() => toast.info('License details')}
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ background: `${T.muted}15`, color: T.muted }}
                      aria-label="View license details"
                      title="View license details"
                    >
                      <Eye className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </Glass>
    </motion.div>
  );
}
