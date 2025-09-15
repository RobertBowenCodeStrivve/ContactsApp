#!/bin/bash

# CONTACTS_APP Shell Initialization
# Add this to your ~/.bashrc or ~/.zshrc:

# Set CONTACTS_HOME if not already set
if [ -z "${CONTACTS_HOME:-}" ]; then
    # Auto-detect based on this script's location
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    export CONTACTS_HOME="$(dirname "$SCRIPT_DIR")"
    echo "Auto-detected CONTACTS_HOME: $CONTACTS_HOME"
fi

# Ensure we're in a CONTACTS_APP project
if [ ! -f "$CONTACTS_HOME/package.json" ]; then
    echo "Warning: CONTACTS_HOME does not appear to be a CONTACTS_APP project directory"
    return 1
fi

# Load all tool scripts
TOOLS_DIR="$CONTACTS_HOME/tools"

# Load docker utilities
if [ -f "$TOOLS_DIR/scripts/docker-utils.sh" ]; then
    source "$TOOLS_DIR/scripts/docker-utils.sh"
fi


echo "CONTACTS_APP development environment loaded!"
echo "CONTACTS_HOME: $CONTACTS_HOME"
echo "Available commands: contacts"