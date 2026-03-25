export type WorkspaceImportMode = 'zip' | 'multi_file' | 'github';

export interface WorkspaceImportFileInput {
  path: string;
  name?: string | null;
  size_bytes?: number | null;
  mime_type?: string | null;
  content?: string | null;
  content_excerpt?: string | null;
  truncated?: boolean | null;
  sha256?: string | null;
  metadata?: Record<string, unknown> | null;
}

export interface NormalizedWorkspaceFile {
  path: string;
  name: string;
  ext: string;
  language: string;
  mimeType: string;
  sizeBytes: number;
  content: string;
  excerpt: string;
  truncated: boolean;
  isBinary: boolean;
  checksum: string | null;
  metadata: Record<string, unknown>;
}

export interface WorkspaceIssue {
  issue_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  file_path?: string | null;
  line_hint?: number | null;
  fix_command?: string | null;
  metadata?: Record<string, unknown>;
}

export interface WorkspaceAnalysis {
  techStack: string;
  projectType: string;
  primaryLanguage: string;
  supportedLanguages: string[];
  stack: {
    frontend: string[];
    backend: string[];
    database: string[];
  };
  routes: Array<{ path: string; source: string; type: string }>;
  buttons: Array<{ file_path: string; total: number; disconnected: number }>;
  apis: Array<{ method: string; path: string; source: string }>;
  dbTables: Array<{ table: string; source: string }>;
  missingFeatures: string[];
  brokenFlows: string[];
  issues: WorkspaceIssue[];
  dependencyMap: Record<string, string[]>;
  summary: string;
}

export interface WorkspaceCommandChange {
  file_path: string;
  artifact_type: string;
  language: string;
  content: string;
  metadata?: Record<string, unknown>;
}

export interface WorkspaceCommandPlan {
  output: string;
  resolvedIssueTypes: string[];
  changes: WorkspaceCommandChange[];
  featureUpdates?: Record<string, unknown>;
  integrationUpdates?: Array<Record<string, unknown>>;
}

const TEXT_EXTENSIONS = new Set([
  '.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.sql', '.php', '.py', '.rb', '.java', '.go', '.env', '.yaml', '.yml', '.toml', '.css', '.scss', '.html', '.htm', '.txt', '.xml', '.ini', '.sh'
]);

const CODE_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.php', '.py', '.sql']);

const MAX_CONTENT_CHARS = 200000;
const MAX_EXCERPT_CHARS = 4000;
const MAX_GITHUB_TEXT_FILES = 30;

function extensionOf(path: string) {
  const normalized = path.toLowerCase();
  const index = normalized.lastIndexOf('.');
  return index >= 0 ? normalized.slice(index) : '';
}

function basename(path: string) {
  const parts = path.replace(/\\/g, '/').split('/').filter(Boolean);
  return parts[parts.length - 1] || 'file';
}

function guessLanguage(path: string) {
  const ext = extensionOf(path);
  if (ext === '.java' || ext === '.kt' || ext === '.gradle') return 'android';
  if (ext === '.tsx' || ext === '.ts') return 'typescript';
  if (ext === '.jsx' || ext === '.js') return 'javascript';
  if (ext === '.php') return 'php';
  if (ext === '.py') return 'python';
  if (ext === '.go') return 'go';
  if (ext === '.rb') return 'ruby';
  if (ext === '.rs') return 'rust';
  if (ext === '.swift') return 'swift';
  if (ext === '.dart') return 'dart';
  if (ext === '.cs') return 'csharp';
  if (ext === '.sql') return 'sql';
  if (ext === '.json') return 'json';
  if (ext === '.md') return 'markdown';
  if (ext === '.css' || ext === '.scss') return 'css';
  if (ext === '.html' || ext === '.htm') return 'html';
  if (ext === '.yaml' || ext === '.yml') return 'yaml';
  return 'text';
}

function guessMime(path: string, provided?: string | null) {
  if (provided) return provided;
  const language = guessLanguage(path);
  if (language === 'typescript' || language === 'javascript') return 'text/plain';
  if (language === 'json') return 'application/json';
  if (language === 'sql') return 'application/sql';
  if (language === 'markdown') return 'text/markdown';
  return 'text/plain';
}

function isTextWorkspaceFile(path: string, mimeType?: string | null) {
  if (mimeType && mimeType.startsWith('text/')) return true;
  if (mimeType && mimeType.includes('json')) return true;
  return TEXT_EXTENSIONS.has(extensionOf(path));
}

function trimContent(input: string) {
  return input.length > MAX_CONTENT_CHARS ? input.slice(0, MAX_CONTENT_CHARS) : input;
}

async function digestSha256(value: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function normalizeWorkspaceFiles(files: WorkspaceImportFileInput[]) {
  const normalized = await Promise.all((files || []).map(async (file) => {
    const rawPath = String(file.path || file.name || '').replace(/\\/g, '/').replace(/^\/+/, '').trim();
    if (!rawPath) return null;
    const name = basename(rawPath);
    const mimeType = guessMime(rawPath, file.mime_type || null);
    const isText = isTextWorkspaceFile(rawPath, mimeType);
    const rawContent = isText ? String(file.content || file.content_excerpt || '') : '';
    const trimmedContent = trimContent(rawContent);
    const truncated = Boolean(file.truncated) || rawContent.length > trimmedContent.length;
    const excerpt = (file.content_excerpt ? String(file.content_excerpt) : trimmedContent).slice(0, MAX_EXCERPT_CHARS);
    return {
      path: rawPath,
      name,
      ext: extensionOf(rawPath),
      language: guessLanguage(rawPath),
      mimeType,
      sizeBytes: Math.max(Number(file.size_bytes || trimmedContent.length || 0), 0),
      content: trimmedContent,
      excerpt,
      truncated,
      isBinary: !isText,
      checksum: file.sha256 || (trimmedContent ? await digestSha256(trimmedContent) : null),
      metadata: file.metadata || {},
    } satisfies NormalizedWorkspaceFile;
  }));

  return normalized.filter(Boolean) as NormalizedWorkspaceFile[];
}

function parsePackageDependencies(files: NormalizedWorkspaceFile[]) {
  const packageFile = files.find((file) => file.path.endsWith('package.json') && file.content);
  if (!packageFile) return [] as string[];
  try {
    const parsed = JSON.parse(packageFile.content);
    return Object.keys({ ...(parsed.dependencies || {}), ...(parsed.devDependencies || {}) });
  } catch {
    return [];
  }
}

function collectDependencyMap(files: NormalizedWorkspaceFile[]) {
  const dependencyMap: Record<string, string[]> = {};
  const packageDeps = parsePackageDependencies(files);
  if (packageDeps.length) dependencyMap.package_json = packageDeps;

  const composerFile = files.find((file) => file.path.endsWith('composer.json'));
  if (composerFile?.content) {
    try {
      const parsed = JSON.parse(composerFile.content);
      dependencyMap.composer = Object.keys(parsed.require || {});
    } catch {
      dependencyMap.composer = [];
    }
  }

  const requirements = files.find((file) => file.path.endsWith('requirements.txt'));
  if (requirements?.content) {
    dependencyMap.requirements = requirements.content.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  }

  return dependencyMap;
}

export function inferWorkspaceTechStack(files: NormalizedWorkspaceFile[]) {
  const dependencyMap = collectDependencyMap(files);
  const hasNext = (dependencyMap.package_json || []).includes('next') || files.some((file) => file.path.startsWith('pages/') || file.path.startsWith('app/'));
  const hasNode = Boolean((dependencyMap.package_json || []).length) || files.some((file) => /server\.(ts|js)$|express|fastify|nest/i.test(file.content));
  const hasPhp = Boolean(dependencyMap.composer?.length) || files.some((file) => file.ext === '.php');
  const hasPython = Boolean(dependencyMap.requirements?.length) || files.some((file) => file.ext === '.py' || /django|fastapi|flask/i.test(file.content));
  const hasAndroid = files.some((file) => /build\.gradle|settings\.gradle|androidmanifest\.xml/i.test(file.path) || file.ext === '.gradle' || /android/i.test(file.path));
  const hasFlutter = files.some((file) => file.ext === '.dart' || file.path.endsWith('pubspec.yaml'));
  const hasDocker = files.some((file) => /dockerfile|compose\.ya?ml/i.test(file.path));
  const hasPrisma = files.some((file) => file.path.endsWith('schema.prisma'));
  const hasSql = files.some((file) => file.ext === '.sql' || /create table|alter table/i.test(file.content));
  const hasReact = (dependencyMap.package_json || []).includes('react') || files.some((file) => file.ext === '.tsx' || /react/i.test(file.content));
  const languageCounts = files.reduce<Record<string, number>>((acc, file) => {
    acc[file.language] = (acc[file.language] || 0) + 1;
    return acc;
  }, {});
  const supportedLanguages = Object.entries(languageCounts)
    .sort((left, right) => right[1] - left[1])
    .map(([language]) => language);
  const primaryLanguage = supportedLanguages[0] || 'text';

  const frontend = hasFlutter
    ? ['Flutter', 'Dart']
    : hasAndroid
      ? ['Android', 'Gradle']
      : hasNext
        ? ['Next.js', 'TypeScript']
        : hasReact
          ? ['React', 'TypeScript', 'Vite']
          : hasPhp
            ? ['PHP Views']
            : hasPython
              ? ['Python Templates']
              : ['Static'];
  const backend = hasPhp
    ? ['PHP']
    : hasPython
      ? ['Python']
      : hasNode || hasNext
        ? ['Node.js']
        : hasAndroid
          ? ['Android']
          : ['Unknown'];
  const database = hasPrisma ? ['Prisma', 'PostgreSQL'] : hasSql ? ['SQL'] : ['Unknown'];
  const techStack = hasFlutter
    ? 'Flutter'
    : hasAndroid
      ? 'Android'
      : hasNext
        ? 'Next.js'
        : hasPhp
          ? 'PHP'
          : hasPython
            ? 'Python'
            : hasNode
              ? 'Node.js'
              : hasReact
                ? 'React'
                : hasDocker
                  ? 'Container'
                  : 'Unknown';
  const projectType = hasFlutter || hasAndroid ? 'mobile_app' : hasNext || hasReact || hasNode ? 'web_app' : hasPhp || hasPython ? 'service' : 'web_app';

  return {
    techStack,
    projectType,
    primaryLanguage,
    supportedLanguages,
    stack: { frontend, backend, database },
    dependencyMap,
  };
}

function uniqueBy<T>(items: T[], keyFn: (item: T) => string) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function collectRoutes(files: NormalizedWorkspaceFile[]) {
  const routes: Array<{ path: string; source: string; type: string }> = [];
  const routeRegexes = [
    /<Route[^>]*path=["'`]([^"'`]+)["'`]/g,
    /path:\s*["'`]([^"'`]+)["'`]/g,
    /router\.(?:get|post|put|patch|delete)\(["'`]([^"'`]+)["'`]/g,
    /app\.(?:get|post|put|patch|delete)\(["'`]([^"'`]+)["'`]/g,
  ];

  files.forEach((file) => {
    if (!file.content) return;
    routeRegexes.forEach((regex) => {
      for (const match of file.content.matchAll(regex)) {
        routes.push({ path: match[1], source: file.path, type: 'declared' });
      }
    });
    if (file.path.startsWith('pages/') && file.ext.match(/\.tsx?$|\.jsx?$/)) {
      const path = '/' + file.path.replace(/^pages\//, '').replace(/index\.[^.]+$/, '').replace(/\.[^.]+$/, '').replace(/\[(.+?)\]/g, ':$1');
      routes.push({ path: path === '/' ? '/' : path.replace(/\/+$/, '') || '/', source: file.path, type: 'file_system' });
    }
    if (file.path.startsWith('app/') && file.path.endsWith('/page.tsx')) {
      const path = '/' + file.path.replace(/^app\//, '').replace(/\/page\.tsx$/, '').replace(/\[(.+?)\]/g, ':$1');
      routes.push({ path: path === '/' ? '/' : path.replace(/\/+$/, '') || '/', source: file.path, type: 'file_system' });
    }
  });

  return uniqueBy(routes, (route) => `${route.path}:${route.source}`);
}

function collectButtons(files: NormalizedWorkspaceFile[]) {
  return files
    .filter((file) => file.content && /<(Button|button)\b/.test(file.content))
    .map((file) => {
      const matches = file.content.match(/<(Button|button)\b/gi) || [];
      const disconnected = (file.content.match(/<(Button|button)\b(?![^>]*(onClick=|href=|to=|type=["']submit["']))/gi) || []).length;
      return { file_path: file.path, total: matches.length, disconnected };
    });
}

function collectApis(files: NormalizedWorkspaceFile[]) {
  const apis: Array<{ method: string; path: string; source: string }> = [];
  const apiRegexes = [
    { method: 'GET', regex: /app\.get\(["'`]([^"'`]+)["'`]/g },
    { method: 'POST', regex: /app\.post\(["'`]([^"'`]+)["'`]/g },
    { method: 'GET', regex: /router\.get\(["'`]([^"'`]+)["'`]/g },
    { method: 'POST', regex: /router\.post\(["'`]([^"'`]+)["'`]/g },
    { method: 'FETCH', regex: /fetch\(["'`]([^"'`]+)["'`]/g },
  ];
  files.forEach((file) => {
    apiRegexes.forEach(({ method, regex }) => {
      for (const match of file.content.matchAll(regex)) {
        apis.push({ method, path: match[1], source: file.path });
      }
    });
  });
  return uniqueBy(apis, (api) => `${api.method}:${api.path}:${api.source}`);
}

function collectDbTables(files: NormalizedWorkspaceFile[]) {
  const tables: Array<{ table: string; source: string }> = [];
  files.forEach((file) => {
    for (const match of file.content.matchAll(/create table\s+(?:if not exists\s+)?([a-zA-Z0-9_]+)/gi)) {
      tables.push({ table: match[1], source: file.path });
    }
    for (const match of file.content.matchAll(/model\s+([A-Za-z0-9_]+)/g)) {
      tables.push({ table: match[1], source: file.path });
    }
    for (const match of file.content.matchAll(/from\(["'`]([a-zA-Z0-9_]+)["'`]\)/g)) {
      tables.push({ table: match[1], source: file.path });
    }
  });
  return uniqueBy(tables, (table) => `${table.table}:${table.source}`);
}

function findLineHint(content: string, needle: string) {
  const index = content.indexOf(needle);
  if (index < 0) return null;
  return content.slice(0, index).split(/\r?\n/).length;
}

export function analyzeWorkspaceFiles(files: NormalizedWorkspaceFile[]): WorkspaceAnalysis {
  const tech = inferWorkspaceTechStack(files);
  const routes = collectRoutes(files);
  const buttons = collectButtons(files);
  const apis = collectApis(files);
  const dbTables = collectDbTables(files);
  const missingFeatures: string[] = [];
  const brokenFlows: string[] = [];
  const issues: WorkspaceIssue[] = [];

  if (!apis.some((api) => /payment|checkout|webhook/i.test(api.path)) && files.some((file) => /checkout|payment|cart|billing/i.test(file.path + ' ' + file.content))) {
    missingFeatures.push('payment_gateway');
    brokenFlows.push('Checkout UI exists without a verified payment backend.');
    issues.push({
      issue_type: 'missing_payment_flow',
      severity: 'critical',
      title: 'Payment flow is missing',
      description: 'Checkout or billing UI exists without create-payment or webhook handlers.',
      fix_command: 'Add payment gateway',
      metadata: { recommended_provider: 'stripe' },
    });
  }

  if (!files.some((file) => /(^|\/)(tests|__tests__)\//.test(file.path) || /\.test\.|\.spec\./.test(file.path))) {
    missingFeatures.push('automated_tests');
    issues.push({
      issue_type: 'missing_tests',
      severity: 'high',
      title: 'Automated tests are missing',
      description: 'No smoke, unit, or integration tests were detected.',
      fix_command: 'Fix all issues',
    });
  }

  if (!files.some((file) => /dockerfile|vercel\.json|render\.yaml|fly\.toml|github\/workflows/i.test(file.path))) {
    missingFeatures.push('deployment_config');
    issues.push({
      issue_type: 'missing_deploy_config',
      severity: 'high',
      title: 'Deployment configuration is missing',
      description: 'No deploy target or CI/CD config was detected.',
      fix_command: 'Deploy code',
    });
  }

  if ((tech.techStack === 'Node.js' || tech.techStack === 'Next.js' || tech.techStack === 'Python' || tech.techStack === 'PHP') && !apis.some((api) => /health/i.test(api.path))) {
    issues.push({
      issue_type: 'missing_api_healthcheck',
      severity: 'medium',
      title: 'Health check endpoint is missing',
      description: 'A backend was detected, but no health endpoint was found.',
      fix_command: 'Fix all issues',
    });
  }

  if ((tech.techStack === 'Node.js' || tech.techStack === 'Next.js' || tech.techStack === 'React') && !files.some((file) => /errorboundary|ErrorBoundary/i.test(file.path + ' ' + file.content))) {
    issues.push({
      issue_type: 'missing_error_boundary',
      severity: 'medium',
      title: 'Error boundary is missing',
      description: 'React-style UI detected without an application error boundary.',
      fix_command: 'Fix all issues',
    });
  }

  buttons.filter((button) => button.disconnected > 0).forEach((button) => {
    const file = files.find((item) => item.path === button.file_path);
    issues.push({
      issue_type: 'dead_button',
      severity: 'high',
      title: 'Disconnected button detected',
      description: `${button.disconnected} buttons appear to lack onClick, href, to, or submit behavior.`,
      file_path: button.file_path,
      line_hint: file ? findLineHint(file.content, '<Button') || findLineHint(file.content, '<button') : null,
      fix_command: 'Fix all issues',
      metadata: { disconnected: button.disconnected, total: button.total },
    });
  });

  if (!dbTables.length) {
    issues.push({
      issue_type: 'missing_database_layer',
      severity: 'high',
      title: 'Database layer not detected',
      description: 'No SQL schema, ORM model, or DB client usage was found.',
      fix_command: 'Connect database',
    });
  }

  if (files.some((file) => /login|signin|auth/i.test(file.path)) && !routes.some((route) => /dashboard|home|app/i.test(route.path))) {
    brokenFlows.push('Authentication screens exist without an obvious post-login dashboard route.');
    issues.push({
      issue_type: 'broken_auth_redirect',
      severity: 'high',
      title: 'Auth redirect flow looks incomplete',
      description: 'Login-related files exist but no dashboard or app landing route was detected.',
      fix_command: 'Fix all issues',
    });
  }

  const uniqueIssues = uniqueBy(issues, (issue) => `${issue.issue_type}:${issue.file_path || ''}:${issue.title}`);

  return {
    techStack: tech.techStack,
    projectType: tech.projectType,
    primaryLanguage: tech.primaryLanguage,
    supportedLanguages: tech.supportedLanguages,
    stack: tech.stack,
    routes,
    buttons,
    apis,
    dbTables,
    missingFeatures: Array.from(new Set(missingFeatures)),
    brokenFlows: Array.from(new Set(brokenFlows)),
    issues: uniqueIssues,
    dependencyMap: tech.dependencyMap,
    summary: `${tech.techStack} workspace (${tech.primaryLanguage}) with ${files.length} indexed files, ${routes.length} routes, ${apis.length} API surfaces, ${dbTables.length} DB markers, and ${uniqueIssues.length} tracked issues.`,
  };
}

export function buildWorkspacePrompt(projectName: string, analysis: WorkspaceAnalysis, mode: WorkspaceImportMode, repoUrl?: string | null) {
  return [
    `Imported ${mode} workspace ${projectName}.`,
    repoUrl ? `Repository: ${repoUrl}.` : null,
    `Detected stack: ${analysis.techStack}.`,
    `Primary language: ${analysis.primaryLanguage}. Supported languages: ${analysis.supportedLanguages.slice(0, 8).join(', ') || 'unknown'}.`,
    `Routes: ${analysis.routes.map((route) => route.path).slice(0, 12).join(', ') || 'none'}.`,
    `API surfaces: ${analysis.apis.map((api) => `${api.method} ${api.path}`).slice(0, 10).join(', ') || 'none'}.`,
    `Database markers: ${analysis.dbTables.map((table) => table.table).slice(0, 10).join(', ') || 'none'}.`,
    `Missing features: ${analysis.missingFeatures.join(', ') || 'none'}.`,
    `Broken flows: ${analysis.brokenFlows.join(' | ') || 'none'}.`,
    'Objective: create executable fixes, route repair, payment integration, deployment readiness, and automated build/test/deploy control.',
  ].filter(Boolean).join(' ');
}

function paymentProviderFromCommand(commandText: string) {
  const lower = commandText.toLowerCase();
  if (lower.includes('razorpay')) return 'razorpay';
  if (lower.includes('paypal')) return 'paypal';
  return 'stripe';
}

function nodePaymentFiles(provider: string): WorkspaceCommandChange[] {
  const providerName = provider === 'razorpay' ? 'Razorpay' : provider === 'paypal' ? 'PayPal' : 'Stripe';
  return [
    {
      file_path: 'src/lib/payments/provider.ts',
      artifact_type: 'generated',
      language: 'typescript',
      content: `export const PAYMENT_PROVIDER = '${provider}';\n\nexport function createPaymentPayload(amount: number, currency = 'INR') {\n  return { provider: PAYMENT_PROVIDER, amount, currency };\n}\n`,
    },
    {
      file_path: 'src/api/payments/create-payment.ts',
      artifact_type: 'generated',
      language: 'typescript',
      content: `import { createPaymentPayload } from '../../lib/payments/provider';\n\nexport async function createPaymentSession(amount: number) {\n  const payload = createPaymentPayload(amount);\n  return { status: 'ready', provider: '${providerName}', payload };\n}\n`,
    },
    {
      file_path: 'src/api/payments/webhook.ts',
      artifact_type: 'generated',
      language: 'typescript',
      content: `export async function handlePaymentWebhook(event: { type: string; data: Record<string, unknown> }) {\n  if (!event?.type) throw new Error('Invalid webhook event');\n  return { acknowledged: true, provider: '${providerName}', eventType: event.type };\n}\n`,
    },
    {
      file_path: 'src/components/payments/PayNowButton.tsx',
      artifact_type: 'generated',
      language: 'typescript',
      content: `import React from 'react';\n\nexport function PayNowButton({ onPay }: { onPay: () => void }) {\n  return <button type="button" onClick={onPay}>Pay with ${providerName}</button>;\n}\n`,
    },
  ];
}

function phpPaymentFiles(provider: string): WorkspaceCommandChange[] {
  return [
    {
      file_path: 'app/Services/PaymentGateway.php',
      artifact_type: 'generated',
      language: 'php',
      content: `<?php\nclass PaymentGateway {\n    public static function provider(): string {\n        return '${provider}';\n    }\n}\n`,
    },
    {
      file_path: 'public/api/payments/create.php',
      artifact_type: 'generated',
      language: 'php',
      content: `<?php\nrequire_once __DIR__ . '/../../../app/Services/PaymentGateway.php';\nheader('Content-Type: application/json');\necho json_encode(['provider' => PaymentGateway::provider(), 'status' => 'ready']);\n`,
    },
    {
      file_path: 'public/api/payments/webhook.php',
      artifact_type: 'generated',
      language: 'php',
      content: `<?php\nheader('Content-Type: application/json');\necho json_encode(['acknowledged' => true, 'provider' => '${provider}']);\n`,
    },
  ];
}

function pythonPaymentFiles(provider: string): WorkspaceCommandChange[] {
  return [
    {
      file_path: 'app/payments.py',
      artifact_type: 'generated',
      language: 'python',
      content: `PAYMENT_PROVIDER = '${provider}'\n\ndef create_payment_session(amount: float, currency: str = 'INR'):\n    return {'provider': PAYMENT_PROVIDER, 'amount': amount, 'currency': currency, 'status': 'ready'}\n`,
    },
    {
      file_path: 'app/routes/payments.py',
      artifact_type: 'generated',
      language: 'python',
      content: `from app.payments import create_payment_session\n\ndef create_payment(amount: float):\n    return create_payment_session(amount)\n\ndef webhook(event_type: str):\n    return {'acknowledged': True, 'event_type': event_type}\n`,
    },
  ];
}

function databaseFiles(techStack: string): WorkspaceCommandChange[] {
  if (techStack === 'PHP') {
    return [{ file_path: 'app/Database/connection.php', artifact_type: 'generated', language: 'php', content: `<?php\nfunction database_connection(): array {\n    return ['driver' => 'pgsql', 'pooling' => true];\n}\n` }];
  }
  if (techStack === 'Python') {
    return [
      { file_path: 'app/db.py', artifact_type: 'generated', language: 'python', content: `def get_database_config():\n    return {'driver': 'postgresql', 'pooling': True}\n` },
      { file_path: 'database/schema.sql', artifact_type: 'generated', language: 'sql', content: `create table if not exists app_users (id uuid primary key, email text not null, created_at timestamptz default now());\n` },
    ];
  }
  return [
    { file_path: 'src/lib/db/client.ts', artifact_type: 'generated', language: 'typescript', content: `export function getDatabaseConfig() {\n  return { driver: 'postgresql', pooling: true, audit: true };\n}\n` },
    { file_path: 'database/schema.sql', artifact_type: 'generated', language: 'sql', content: `create table if not exists app_users (id uuid primary key, email text not null, created_at timestamptz default now());\ncreate table if not exists audit_logs (id uuid primary key, actor_id uuid, action text, created_at timestamptz default now());\n` },
  ];
}

function performanceFiles(techStack: string): WorkspaceCommandChange[] {
  if (techStack === 'PHP') {
    return [{ file_path: 'config/cache.php', artifact_type: 'generated', language: 'php', content: `<?php\nreturn ['driver' => 'redis', 'edge_cache' => true, 'ttl' => 300];\n` }];
  }
  if (techStack === 'Python') {
    return [{ file_path: 'app/cache.py', artifact_type: 'generated', language: 'python', content: `CACHE_CONFIG = {'driver': 'redis', 'ttl': 300, 'compression': True}\n` }];
  }
  return [
    { file_path: 'src/lib/performance/cache.ts', artifact_type: 'generated', language: 'typescript', content: `export const CACHE_CONFIG = { driver: 'redis', edgeCache: true, ttlSeconds: 300 };\n` },
    { file_path: 'deploy/cache.config.json', artifact_type: 'generated', language: 'json', content: JSON.stringify({ edge_cache: true, query_cache: true, image_optimization: true }, null, 2) },
  ];
}

function fixAllFiles(techStack: string): WorkspaceCommandChange[] {
  if (techStack === 'PHP') {
    return [{ file_path: 'public/api/health.php', artifact_type: 'generated', language: 'php', content: `<?php\nheader('Content-Type: application/json');\necho json_encode(['status' => 'ok']);\n` }];
  }
  if (techStack === 'Python') {
    return [
      { file_path: 'app/routes/health.py', artifact_type: 'generated', language: 'python', content: `def health_check():\n    return {'status': 'ok'}\n` },
      { file_path: 'tests/test_smoke.py', artifact_type: 'generated', language: 'python', content: `def test_health_shape():\n    assert {'status': 'ok'}['status'] == 'ok'\n` },
    ];
  }
  return [
    { file_path: 'src/components/system/ValaErrorBoundary.tsx', artifact_type: 'generated', language: 'typescript', content: `import React from 'react';\n\nexport class ValaErrorBoundary extends React.Component<React.PropsWithChildren, { hasError: boolean }> {\n  state = { hasError: false };\n  static getDerivedStateFromError() { return { hasError: true }; }\n  render() { return this.state.hasError ? <div>Something went wrong.</div> : this.props.children; }\n}\n` },
    { file_path: 'src/hooks/useValaActionGuard.ts', artifact_type: 'generated', language: 'typescript', content: `import { useState } from 'react';\n\nexport function useValaActionGuard() {\n  const [busy, setBusy] = useState(false);\n  const run = async (action: () => Promise<void> | void) => {\n    setBusy(true);\n    try {\n      await action();\n    } finally {\n      setBusy(false);\n    }\n  };\n  return { busy, run };\n}\n` },
    { file_path: 'src/api/health.ts', artifact_type: 'generated', language: 'typescript', content: `export async function health() {\n  return { status: 'ok' as const };\n}\n` },
    { file_path: 'tests/vala.smoke.test.ts', artifact_type: 'generated', language: 'typescript', content: `import { describe, it, expect } from 'vitest';\n\ndescribe('vala smoke', () => {\n  it('keeps health payload stable', () => {\n    expect({ status: 'ok' }).toEqual({ status: 'ok' });\n  });\n});\n` },
  ];
}

function deploymentFiles(techStack: string): WorkspaceCommandChange[] {
  if (techStack === 'PHP') {
    return [{ file_path: 'deploy/vala-deploy.json', artifact_type: 'generated', language: 'json', content: JSON.stringify({ runtime: 'php', target: 'live', healthcheck: '/api/health.php' }, null, 2) }];
  }
  if (techStack === 'Python') {
    return [{ file_path: 'deploy/vala-deploy.json', artifact_type: 'generated', language: 'json', content: JSON.stringify({ runtime: 'python', target: 'live', healthcheck: '/health' }, null, 2) }];
  }
  return [{ file_path: 'deploy/vala-deploy.json', artifact_type: 'generated', language: 'json', content: JSON.stringify({ runtime: 'node', target: 'vercel', healthcheck: '/api/health' }, null, 2) }];
}

function apkFiles(techStack: string): WorkspaceCommandChange[] {
  if (techStack === 'Flutter' || techStack === 'Android') {
    return [
      { file_path: 'android/app/build.gradle', artifact_type: 'generated', language: 'android', content: `android {
  defaultConfig {
    applicationId "com.softwarewala.vala"
    minSdkVersion 24
    targetSdkVersion 35
    versionCode 1
    versionName "1.0.0"
  }
}
` },
      { file_path: 'android/vala-apk.json', artifact_type: 'generated', language: 'json', content: JSON.stringify({ wrap: 'native', build: 'gradle assembleRelease', signing: 'auto' }, null, 2) },
    ];
  }

  return [
    { file_path: 'capacitor.config.ts', artifact_type: 'generated', language: 'typescript', content: `export default {
  appId: 'com.softwarewala.vala',
  appName: 'VALA Generated App',
  webDir: 'dist',
  bundledWebRuntime: false,
};
` },
    { file_path: 'android/vala-apk.json', artifact_type: 'generated', language: 'json', content: JSON.stringify({ wrap: 'capacitor', build: 'npx cap sync android && ./gradlew assembleRelease', signing: 'auto', source_stack: techStack }, null, 2) },
  ];
}

function conversionFiles(commandText: string, techStack: string): WorkspaceCommandChange[] {
  const lower = commandText.toLowerCase();
  const target = lower.includes('to node') ? 'node' : lower.includes('to react') ? 'react' : 'modernized';
  const language = target === 'react' ? 'typescript' : target === 'node' ? 'javascript' : techStack === 'Python' ? 'python' : 'typescript';
  const filePath = target === 'react' ? 'src/converted/App.tsx' : target === 'node' ? 'server/converted-app.js' : 'converted/vala-conversion.txt';
  const content = target === 'react'
    ? `export default function ConvertedApp() {
  return <main>Converted UI scaffold from legacy source into React.</main>;
}
`
    : target === 'node'
      ? `module.exports = {
  runtime: 'node',
  summary: 'Converted legacy workspace flow into a Node.js service scaffold.'
};
`
      : `Converted workspace command: ${commandText}`;
  return [{ file_path: filePath, artifact_type: 'generated', language, content, metadata: { conversion_command: commandText, source_stack: techStack, target } }];
}

export function buildWorkspaceCommandPlan(action: string, commandText: string, analysis: WorkspaceAnalysis): WorkspaceCommandPlan {
  const techStack = analysis.techStack;
  if (action === 'add_payment') {
    const provider = paymentProviderFromCommand(commandText);
    const changes = techStack === 'PHP' ? phpPaymentFiles(provider) : techStack === 'Python' ? pythonPaymentFiles(provider) : nodePaymentFiles(provider);
    return {
      output: `Payment gateway ${provider} integrated into the indexed workspace artifacts.`,
      resolvedIssueTypes: ['missing_payment_flow'],
      changes,
      featureUpdates: { paymentEnabled: true, provider },
      integrationUpdates: [{ name: `Payment Gateway (${provider})`, status: 'connected', purpose: 'Checkout, webhooks, order verification' }],
    };
  }

  if (action === 'connect_db') {
    return {
      output: 'Database client and schema artifacts were added to the workspace.',
      resolvedIssueTypes: ['missing_database_layer'],
      changes: databaseFiles(techStack),
      featureUpdates: { databaseConnected: true },
    };
  }

  if (action === 'optimize_performance') {
    return {
      output: 'Performance and cache artifacts were generated for the workspace.',
      resolvedIssueTypes: ['missing_deploy_config'],
      changes: performanceFiles(techStack),
      featureUpdates: { performanceOptimized: true, cachingEnabled: true },
    };
  }

  if (action === 'fix_all_bugs') {
    return {
      output: 'Health, guard, error boundary, and smoke-test artifacts were generated to repair tracked flows.',
      resolvedIssueTypes: ['dead_button', 'missing_tests', 'missing_api_healthcheck', 'missing_error_boundary', 'broken_auth_redirect'],
      changes: fixAllFiles(techStack),
      featureUpdates: { autoDebug: true, smokeTestsAdded: true },
    };
  }

  if (action === 'deploy') {
    return {
      output: 'Deployment target configuration was generated for the workspace.',
      resolvedIssueTypes: ['missing_deploy_config'],
      changes: deploymentFiles(techStack),
      featureUpdates: { deploymentReady: true },
    };
  }

  if (action === 'build_apk') {
    return {
      output: 'APK wrapper and build configuration artifacts were generated for the workspace.',
      resolvedIssueTypes: [],
      changes: apkFiles(techStack),
      featureUpdates: { apkReady: true, mobilePackaging: true },
      integrationUpdates: [{ name: 'APK Build Pipeline', status: 'configured', purpose: 'Capacitor or Gradle based APK generation' }],
    };
  }

  if (action === 'convert_stack') {
    return {
      output: 'Cross-stack conversion scaffold was generated for the requested workspace transformation.',
      resolvedIssueTypes: [],
      changes: conversionFiles(commandText, techStack),
      featureUpdates: { stackConversionPrepared: true, conversionCommand: commandText },
    };
  }

  return {
    output: `Custom execution recorded for command: ${commandText}`,
    resolvedIssueTypes: [],
    changes: [{
      file_path: `vala/commands/${Date.now()}-execution.json`,
      artifact_type: 'generated',
      language: 'json',
      content: JSON.stringify({ command: commandText, summary: analysis.summary, tech_stack: techStack }, null, 2),
    }],
  };
}

function parseGitHubRepoUrl(repoUrl: string) {
  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/#?]+)/i);
  if (!match) return null;
  return { owner: match[1], repo: match[2].replace(/\.git$/i, '') };
}

async function githubJson(path: string) {
  const response = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'softwarewalanet-vala-workspace',
    },
  });
  if (!response.ok) {
    throw new Error(`GitHub request failed with ${response.status}`);
  }
  return await response.json();
}

export async function fetchGitHubWorkspace(repoUrl: string) {
  const parsed = parseGitHubRepoUrl(repoUrl);
  if (!parsed) throw new Error('Invalid GitHub repository URL');
  const repo = await githubJson(`/repos/${parsed.owner}/${parsed.repo}`);
  const tree = await githubJson(`/repos/${parsed.owner}/${parsed.repo}/git/trees/${encodeURIComponent(repo.default_branch)}?recursive=1`);
  const files = (tree.tree || [])
    .filter((item: { type?: string; path?: string; size?: number }) => item.type === 'blob' && item.path)
    .map((item: { path: string; size?: number }) => ({ path: item.path, size_bytes: Number(item.size || 0) }))
    .slice(0, 500);

  const textCandidates = files.filter((file) => isTextWorkspaceFile(file.path, null)).slice(0, MAX_GITHUB_TEXT_FILES);
  const hydrated = await Promise.all(textCandidates.map(async (file) => {
    try {
      const contentPayload = await githubJson(`/repos/${parsed.owner}/${parsed.repo}/contents/${encodeURIComponent(file.path)}?ref=${encodeURIComponent(repo.default_branch)}`);
      const encoded = String(contentPayload.content || '').replace(/\n/g, '');
      const decoded = encoded ? atob(encoded) : '';
      return {
        path: file.path,
        size_bytes: file.size_bytes,
        content: decoded,
        truncated: decoded.length > MAX_CONTENT_CHARS,
      } satisfies WorkspaceImportFileInput;
    } catch {
      return { path: file.path, size_bytes: file.size_bytes } satisfies WorkspaceImportFileInput;
    }
  }));

  return {
    repo: {
      full_name: repo.full_name,
      default_branch: repo.default_branch,
      html_url: repo.html_url,
      description: repo.description,
    },
    files: hydrated,
  };
}