#!/usr/bin/env bash
# ================================================================
# Bank-Grade Payment Security — Comprehensive Test Suite Runner
# ================================================================
# Usage: bash scripts/test-suite.sh [--coverage] [--suite <suite_name>]
# ================================================================

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
REPORT_DIR="$REPO_ROOT/test-reports/$TIMESTAMP"
mkdir -p "$REPORT_DIR"

COVERAGE=false
SPECIFIC_SUITE=""

# Parse args
while [[ $# -gt 0 ]]; do
  case $1 in
    --coverage) COVERAGE=true; shift ;;
    --suite) SPECIFIC_SUITE="$2"; shift 2 ;;
    *) echo "Unknown arg: $1"; exit 1 ;;
  esac
done

# Colours
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'

print_header() { echo -e "\n${BLUE}================================================================${NC}"; echo -e "${BLUE}  $1${NC}"; echo -e "${BLUE}================================================================${NC}"; }
pass() { echo -e "${GREEN}  ✅ PASS${NC} — $1"; }
fail() { echo -e "${RED}  ❌ FAIL${NC} — $1"; }
warn() { echo -e "${YELLOW}  ⚠️  WARN${NC} — $1"; }

# ── Results accumulator ──────────────────────────────────────────
declare -A SUITE_RESULTS
TOTAL_PASS=0
TOTAL_FAIL=0
CRITICAL_ISSUES=()
START_TIME=$SECONDS

# ── Run a Jest suite ─────────────────────────────────────────────
run_suite() {
  local suite_name="$1"
  local pattern="$2"
  local report_file="$REPORT_DIR/${suite_name}.json"

  echo -e "\n${YELLOW}▶ Running $suite_name tests...${NC}"

  local jest_args=(
    --testPathPatterns="$pattern"
    --json --outputFile="$report_file"
    --forceExit
  )
  if $COVERAGE; then
    jest_args+=(--coverage --coverageDirectory="$REPORT_DIR/coverage-$suite_name")
  fi

  if npx jest "${jest_args[@]}" 2>/dev/null; then
    local passed failed
    passed=$(node -e "const r=require('$report_file'); console.log(r.numPassedTests||0)" 2>/dev/null || echo 0)
    failed=$(node -e "const r=require('$report_file'); console.log(r.numFailedTests||0)" 2>/dev/null || echo 0)
    SUITE_RESULTS[$suite_name]="PASS $passed/$((passed+failed))"
    TOTAL_PASS=$((TOTAL_PASS + passed))
    TOTAL_FAIL=$((TOTAL_FAIL + failed))
    pass "$suite_name ($passed tests passed)"
  else
    local passed failed
    passed=$(node -e "const r=require('$report_file'); console.log(r.numPassedTests||0)" 2>/dev/null || echo 0)
    failed=$(node -e "const r=require('$report_file'); console.log(r.numFailedTests||0)" 2>/dev/null || echo 0)
    SUITE_RESULTS[$suite_name]="FAIL $passed/$((passed+failed))"
    TOTAL_PASS=$((TOTAL_PASS + passed))
    TOTAL_FAIL=$((TOTAL_FAIL + failed))
    fail "$suite_name ($failed tests failed)"
    CRITICAL_ISSUES+=("$suite_name: $failed test(s) failed")
  fi
}

# ── Env check ────────────────────────────────────────────────────
print_header "ENVIRONMENT CHECK"
if [ -f ".env.test" ]; then
  pass ".env.test found"
  set -a; source .env.test; set +a
else
  warn ".env.test not found, using defaults"
fi

node_ver=$(node --version)
echo -e "  Node.js: $node_ver"
echo -e "  Working directory: $REPO_ROOT"
echo -e "  Report directory: $REPORT_DIR"

# ── Run suites ───────────────────────────────────────────────────
if [ -z "$SPECIFIC_SUITE" ]; then
  print_header "UNIT TESTS"
  run_suite "unit" "tests/unit"

  print_header "INTEGRATION TESTS"
  run_suite "integration" "tests/integration"

  print_header "SECURITY TESTS"
  run_suite "security" "tests/security"

  print_header "LOAD TESTS"
  run_suite "load" "tests/load"

  print_header "PENETRATION TESTS"
  run_suite "penetration" "tests/penetration"
else
  print_header "RUNNING SUITE: $SPECIFIC_SUITE"
  run_suite "$SPECIFIC_SUITE" "tests/$SPECIFIC_SUITE"
fi

# ── Coverage ─────────────────────────────────────────────────────
COVERAGE_PCT="N/A"
if $COVERAGE; then
  print_header "CODE COVERAGE"
  COVERAGE_FILE="$REPORT_DIR/coverage-unit/coverage-summary.json"
  if [ -f "$COVERAGE_FILE" ]; then
    COVERAGE_PCT=$(node -e "
      const s=require('$COVERAGE_FILE').total;
      const pct=((s.lines.covered/s.lines.total)*100).toFixed(1);
      console.log(pct+'%');
    " 2>/dev/null || echo "N/A")
    echo -e "  Line coverage: ${GREEN}$COVERAGE_PCT${NC}"
  fi
fi

# ── Final Report ─────────────────────────────────────────────────
ELAPSED=$((SECONDS - START_TIME))
TOTAL=$((TOTAL_PASS + TOTAL_FAIL))

print_header "PAYMENT SECURITY TEST REPORT"
echo ""
echo "  Execution Time   : ${ELAPSED}s"
echo "  Total Tests      : $TOTAL"
echo -e "  Tests Passed     : ${GREEN}$TOTAL_PASS${NC}"
echo -e "  Tests Failed     : ${RED}$TOTAL_FAIL${NC}"
echo "  Code Coverage    : $COVERAGE_PCT"
echo ""
echo "  Suite Results:"
for suite in "${!SUITE_RESULTS[@]}"; do
  result="${SUITE_RESULTS[$suite]}"
  if [[ "$result" == PASS* ]]; then
    echo -e "    ${GREEN}✅ PASS${NC}  $suite — ${result#PASS }"
  else
    echo -e "    ${RED}❌ FAIL${NC}  $suite — ${result#FAIL }"
  fi
done

if [ ${#CRITICAL_ISSUES[@]} -gt 0 ]; then
  echo ""
  echo -e "  ${RED}Critical Issues:${NC}"
  for issue in "${CRITICAL_ISSUES[@]}"; do
    echo -e "    ${RED}• $issue${NC}"
  done
fi

# ── Safe-to-merge verdict ─────────────────────────────────────────
echo ""
echo "════════════════════════════════════════════════════════════════"
if [ $TOTAL_FAIL -eq 0 ] && [ $TOTAL -gt 0 ]; then
  echo -e "  ${GREEN}✅ SAFE TO MERGE? YES${NC}"
  echo -e "  All $TOTAL tests passed. Payment security validated."
else
  echo -e "  ${RED}❌ SAFE TO MERGE? NO${NC}"
  echo -e "  $TOTAL_FAIL test(s) failed. Fix all issues before merging."
fi
echo "════════════════════════════════════════════════════════════════"
echo ""

# ── JSON report ───────────────────────────────────────────────────
FINAL_REPORT="$REPORT_DIR/final-report.json"

# Build JSON array for critical issues
ISSUES_JSON='[]'
if [ ${#CRITICAL_ISSUES[@]} -gt 0 ]; then
  ISSUES_JSON='['
  for i in "${!CRITICAL_ISSUES[@]}"; do
    escaped="${CRITICAL_ISSUES[$i]//\"/\\\"}"
    ISSUES_JSON+="\"$escaped\""
    [ $i -lt $((${#CRITICAL_ISSUES[@]} - 1)) ] && ISSUES_JSON+=','
  done
  ISSUES_JSON+=']'
fi

node -e "
const fs = require('fs');
const report = {
  timestamp: '$(date -u +%Y-%m-%dT%H:%M:%SZ)',
  execution_time_seconds: $ELAPSED,
  total_tests: $TOTAL,
  passed: $TOTAL_PASS,
  failed: $TOTAL_FAIL,
  coverage: '$COVERAGE_PCT',
  safe_to_merge: $( [ $TOTAL_FAIL -eq 0 ] && echo 'true' || echo 'false' ),
  critical_issues: ${ISSUES_JSON},
};
fs.writeFileSync('$FINAL_REPORT', JSON.stringify(report, null, 2));
console.log('  Report saved: $FINAL_REPORT');
" 2>/dev/null || true

# Exit with failure code if any tests failed
[ $TOTAL_FAIL -eq 0 ]
