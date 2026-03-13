#!/usr/bin/env node
/**
 * AI Gateway Compliance Linter
 * 
 * Scans source files and flags any direct fetch() or axios() calls
 * to known external AI/API provider domains that bypass AI_GATEWAY().
 *
 * Usage:
 *   node scripts/lint-ai-gateway-compliance.js
 *   node scripts/lint-ai-gateway-compliance.js --strict   (exit 1 on violations)
 *
 * This script is intended to run as a pre-commit or CI check.
 */

import { readdirSync, readFileSync, statSync } from 'fs';
import { join, extname, relative } from 'path';

const BLOCKED_DOMAINS = [
  'api.openai.com',
  'api.elevenlabs.io',
  'api.github.com',
  'graph.facebook.com',
  'api.stripe.com',
  'fcm.googleapis.com',
];

const ALLOWED_FILES = [
  // Gateway internals are allowed to reference these domains in config only
  'src/lib/ai-orchestration/ai-gateway.ts',
  'src/lib/ai-orchestration/api-manager.ts',
  'src/middleware/ai-gateway-middleware.ts',
  'src/routes/admin/ai-services.ts',
];

// Build domain alternation from BLOCKED_DOMAINS – single source of truth
const _domainAlt = BLOCKED_DOMAINS.map(d => d.replace(/\./g, '\\.')).join('|');

// Patterns that indicate a direct external call (not just a string reference)
const VIOLATION_PATTERNS = [
  new RegExp(`fetch\\s*\\(\\s*['"\`][^'"\`]*(?:${_domainAlt})`, 'i'),
  new RegExp(`axios\\s*\\.\\s*(?:get|post|put|patch|delete)\\s*\\(\\s*['"\`][^'"\`]*(?:${_domainAlt})`, 'i'),
  new RegExp(`axios\\s*\\(\\s*\\{[^}]*url\\s*:\\s*['"\`][^'"\`]*(?:${_domainAlt})`, 'i'),
  /new\s+XMLHttpRequest/i,
];

const SOURCE_DIRS = ['src'];
const EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];
const isStrict = process.argv.includes('--strict');

let violations = 0;

function scanFile(filePath) {
  const relPath = relative(process.cwd(), filePath).replace(/\\/g, '/');

  // Skip allowed gateway internals
  if (ALLOWED_FILES.some(f => relPath.endsWith(f.replace(/^\//, '')))) return;

  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    for (const pattern of VIOLATION_PATTERNS) {
      if (pattern.test(line)) {
        console.error(
          `[AI-GATEWAY-COMPLIANCE] VIOLATION in ${relPath}:${idx + 1}\n` +
          `  Direct external API call detected. Use AI_GATEWAY() instead.\n` +
          `  → ${line.trim()}\n`
        );
        violations++;
        break;
      }
    }
  });
}

function scanDir(dir) {
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      if (['node_modules', 'dist', '.git', 'build'].includes(entry)) continue;
      scanDir(full);
    } else if (stat.isFile() && EXTENSIONS.includes(extname(entry))) {
      scanFile(full);
    }
  }
}

console.log('🔍 AI Gateway Compliance Linter – scanning source files…\n');

for (const dir of SOURCE_DIRS) {
  const fullDir = join(process.cwd(), dir);
  try {
    scanDir(fullDir);
  } catch {
    // Directory may not exist in all environments
  }
}

if (violations === 0) {
  console.log('✅ No AI gateway compliance violations found.\n');
} else {
  console.error(`\n❌ Found ${violations} AI gateway compliance violation(s).\n`);
  console.error('   All external AI/API calls must use AI_GATEWAY() from');
  console.error('   src/lib/ai-orchestration/ai-gateway.ts\n');
  if (isStrict) process.exit(1);
}
