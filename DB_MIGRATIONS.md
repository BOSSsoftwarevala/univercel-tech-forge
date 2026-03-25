# Database Migration Guide - Flyway Automated Pipeline

## Overview

This project uses **Flyway** for automated, versioned database migrations. All schema changes MUST go through this pipeline. **Manual SQL execution is forbidden in production.**

## Current Status

- ✅ 132 migrations consolidated (V001-V132)
- ✅ Flyway configuration ready
- ✅ GitHub Actions CI/CD pipeline enabled
- ✅ Rollback procedures documented

## Creating a New Migration

### 1. Create Migration File

```bash
# Find current max version
MAX_VERSION=$(ls db-migrations/sql/V*.sql | sed 's/.*V//' | sed 's/__.*//' | sort -n | tail -1)
NEW_VERSION=$((MAX_VERSION + 1))
NEW_FILE=$(printf "db-migrations/sql/V%03d__your_description.sql" $NEW_VERSION)
touch $NEW_FILE
-- V133__add_new_table.sql

CREATE TABLE IF NOT EXISTS public.new_table (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_new_table_id ON public.new_table(id);
-- db-migrations/undo/U133__add_new_table.sql

DROP TABLE IF EXISTS public.new_table CASCADE;
git add db-migrations/
git commit -m "Add migration: V133__add_new_table"
git push origin feature-branch
# GitHub Actions will test automatically
# Check Flyway info
flyway info \
  -url=jdbc:postgresql://host/db \
  -user=user \
  -password=pass

# Query applied migrations
psql -h host -U user -d db -c \
  "SELECT version, description, installed_on FROM flyway_schema_history ORDER BY installed_on DESC LIMIT 20;"
mkdir -p /root/softwarewalanet-revert/.github/PULL_REQUEST_TEMPLATE

cat > /root/softwarewalanet-revert/.github/PULL_REQUEST_TEMPLATE/migration.md << 'EOF'
# Database Migration Pull Request

## 📋 Migration Checklist

- [ ] Migration file follows naming: `V###__description.sql`
- [ ] Migration is idempotent (IF NOT EXISTS, CREATE OR REPLACE)
- [ ] Undo script created in `db-migrations/undo/U###__description.sql`
- [ ] No DELETE, DROP DATABASE, or destructive operations
- [ ] Tested locally or in test environment
- [ ] No manual SQL execution in production
- [ ] Rollback procedure documented

## Migration Details

**Version:** V###
**Description:** 
**Database:** Production / Staging / Both
**Impact:** Low / Medium / High
**Rollback tested:** Yes / No

## Changes Summary

Describe the schema changes:

---

**Remember:** All database changes must go through this pipeline.
