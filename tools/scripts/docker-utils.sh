#!/bin/bash

# contacts Docker Management Tool
# Source this file to load the contacts command
# Usage: source docker-utils.sh

# COMPOSE_DIR will be set dynamically using CONTACTS_HOME

# Navigate to compose directory and run command

_docker_compose_contacts() {
    _check_contacts_home || return 1
    COMPOSE_DIR="$CONTACTS_HOME/tools/docker-compose"
    (cd "$COMPOSE_DIR" && docker compose -p contactsapp "$@")
}

_check_contacts_home() {
    if [ -z "${CONTACTS_HOME:-}" ]; then
        echo "Error: CONTACTS_HOME environment variable is not set or exported"
        echo "Please export CONTACTS_HOME=/path/to/contacts"
        return 1
    fi
}

_migrate_contacts(){
    echo "Running database migrations..."
    _docker_compose_contacts up flyway
    echo "generating schema for kysely using kysely-codegen"
    _docker_compose_contacts up schema-codegen
}

contacts() {
    _check_contacts_home || return 1
    case "$1" in
        "stack")
            case "$2" in
                "up")
                    if [ -n "$3" ]; then
                        echo "Starting $3 service..."
                        _docker_compose_contacts up -d "$3"
                    else
                        echo "Starting contacts stack..."
                        _docker_compose_contacts up -d
                    fi
                    ;;
                "down")
                    if [ -n "$3" ]; then
                        echo "Stopping $3 service..."
                        _docker_compose_contacts stop "$3"
                    else
                        echo "Stopping contacts stack..."
                        _docker_compose_contacts down
                    fi
                    ;;
                "restart")
                    if [ -n "$3" ]; then
                        echo "Restarting $3 service..."
                        _docker_compose_contacts restart "$3"
                    else
                        echo "Restarting contacts stack..."
                        _docker_compose_contacts down && _docker_compose_contacts up -d
                    fi
                    ;;
                "status")
                    echo "contacts stack status:"
                    _docker_compose_contacts ps
                    ;;
                *)
                    echo "Usage: contacts stack [up|down|restart|status] [service]"
                    echo "Services: contacts-api, contacts-db, flyway, contacts-web-app, schema-codegen"
                    ;;
            esac
            ;;
        "build")
            case "$2" in
                "stack")
                    if [ "$3" = "--migrate" ] || [ ! -f "$CONTACTS_HOME/common/database/src/schema.ts" ]; then
                        echo "Building contacts db..."
                        _docker_compose_contacts build contacts-db
                        echo "Migrating and generating schema"
                        _migrate_contacts
                        echo "Building remaining services..."
                        _docker_compose_contacts build
                    elif [ -n "$3" ]; then
                        echo "Building $3 service..."
                        _docker_compose_contacts build "$3"
                    else
                        echo "Building contacts services..."
                        _docker_compose_contacts build
                    fi
                    ;;
                *)
                    echo "Usage: contacts build stack [service|--migrate]"
                    ;;
            esac
            ;;
        "logs")
            if [ -n "$2" ]; then
                echo "Showing logs for $2..."
                _docker_compose_contacts logs -f "$2"
            else
                echo "Showing all logs..."
                _docker_compose_contacts logs -f
            fi
            ;;
        "migrate")
            _migrate_contacts
            ;;
        "clean")
            echo "Cleaning up containers, networks, and volumes..."
            _docker_compose_contacts down -v
            docker system prune -f
            ;;
        "help"|"")
            echo "contacts Docker Management Tool"
            echo ""
            echo "Usage: contacts <command> [args...]"
            echo ""
            echo "Commands:"
            echo "  stack up [service]      - Start stack or specific service"
            echo "  stack down [service]    - Stop stack or specific service"  
            echo "  stack restart [service] - Restart stack or specific service"
            echo "  stack status            - Show container status"
            echo "  build stack [service]   - Build stack or specific service"
            echo "  logs [service]          - Show logs (all or specific service)"
            echo "  migrate                 - Run database migrations"
            echo "  clean                   - Stop and cleanup everything"
            echo "  help                    - Show this help"
            echo ""
            echo "Services: contacts-api, contacts-db, flyway"
            echo ""
            echo "Examples:"
            echo "  contacts stack up"
            echo "  contacts stack up contacts-api"
            echo "  contacts stack down"
            echo "  contacts build stack"
            echo "  contacts logs contacts-api"
            ;;
        *)
            echo "Unknown command: $1"
            echo "Run 'contacts help' for usage information"
            ;;
    esac
}

echo "contacts Docker utilities loaded!"
echo "Type 'contacts help' for available commands"