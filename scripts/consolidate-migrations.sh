#!/bin/bash

# Script to consolidate Supabase migrations to Flyway format
# Setting up directories
SUPABASE_MIGRATIONS_DIR="supabase/migrations/"
UNDO_SCRIPTS_DIR="db-migrations/undo/"

# Create undo scripts directory if it doesn't exist
mkdir -p "$UNDO_SCRIPTS_DIR"

# Initialize a counter for versioning
version=1

# Log the progress
log_file="migration_consolidation.log"

# Start the log
echo "Consolidation started at $(date)" >> "$log_file"

# Iterate through all existing Supabase migrations
for migration in "$SUPABASE_MIGRATIONS_DIR"*.sql; do
    if [ -f "$migration" ]; then
        # Extract the migration name without path and extension
        migration_name="$(basename "$migration" .sql)"
        
        # Create Flyway formatted migration file
        flyway_file="V$(printf "%03d" $version)__${migration_name}.sql"
        cp "$migration" "$flyway_file"

        # Create undo script for the migration
        undo_script="UNDO_${migration_name}.sql"
        echo "-- Undo script for ${migration_name}" > "$UNDO_SCRIPTS_DIR$undo_script"
        echo "DROP TABLE IF EXISTS ${migration_name};" >> "$UNDO_SCRIPTS_DIR$undo_script"

        # Log the processed migration
        echo "Processed $migration_name to $flyway_file and created $undo_script" >> "$log_file"
        
        # Increment the version counter
        version=$((version + 1))
    fi
done

# Log the completion
echo "Consolidation completed at $(date)" >> "$log_file"