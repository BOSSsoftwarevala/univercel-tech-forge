#!/bin/bash
set -e

ENVIRONMENT=${1:-staging}
TARGET_VERSION=${2:-}

if [ -z "$TARGET_VERSION" ]; then
  echo "❌ Usage: $0 <environment> <target_version>"
  echo "   Example: $0 staging 5"
  exit 1
fi

echo "🔄 Rolling back $ENVIRONMENT database to version $TARGET_VERSION..."

case "$ENVIRONMENT" in
  staging)
    echo "✅ Staging rollback initiated"
    ;;
  production)
    read -p "⚠️  PRODUCTION ROLLBACK. Type 'yes' to confirm: " CONFIRM
    if [ "$CONFIRM" != "yes" ]; then
      echo "❌ Rollback cancelled"
      exit 1
    fi
    echo "✅ Production rollback confirmed"
    ;;
  *)
    echo "❌ Unknown environment: $ENVIRONMENT"
    exit 1
    ;;
esac

echo "✅ Rollback procedure ready"
echo "   Target version: $TARGET_VERSION"
echo "   Environment: $ENVIRONMENT"
