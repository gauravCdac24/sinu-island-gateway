.PHONY: help build up down logs restart clean

help:
	@echo "Available commands:"
	@echo "  make staging-up     - Start staging environment"
	@echo "  make staging-down   - Stop staging environment"
	@echo "  make staging-logs   - View staging logs"
	@echo "  make staging-build  - Build staging images"
	@echo "  make production-up  - Start production environment"
	@echo "  make production-down - Stop production environment"
	@echo "  make production-logs - View production logs"
	@echo "  make production-build - Build production images"
	@echo "  make frontend-dev   - Start frontend in development mode"
	@echo "  make clean          - Remove all containers and volumes"

staging-up:
	docker-compose --env-file .env.staging -f docker-compose-staging.yml up -d

staging-down:
	docker-compose --env-file .env.staging -f docker-compose-staging.yml down

staging-logs:
	docker-compose --env-file .env.staging -f docker-compose-staging.yml logs -f

staging-build:
	docker-compose --env-file .env.staging -f docker-compose-staging.yml build

staging-restart:
	docker-compose --env-file .env.staging -f docker-compose-staging.yml restart

production-up:
	docker-compose --env-file .env.production -f docker-compose.yml up -d

production-down:
	docker-compose --env-file .env.production -f docker-compose.yml down

production-logs:
	docker-compose --env-file .env.production -f docker-compose.yml logs -f

production-build:
	docker-compose --env-file .env.production -f docker-compose.yml build

production-restart:
	docker-compose --env-file .env.production -f docker-compose.yml restart

# Frontend development
dev:
	npm run dev -- --host

frontend-build:
	 npm run build

frontend-preview:
	npm run preview -- --host

server-start:
	npm run server

# Cleanup
clean:
	docker-compose --env-file .env.staging -f docker-compose-staging.yml down -v
	docker-compose --env-file .env.production -f docker-compose.yml down -v
	docker system prune -f --volumes

# Utility commands (PostgreSQL)
db-backup:
	docker exec $$(docker-compose --env-file .env.production -f docker-compose.yml ps -q postgres) pg_dump -U sinu sinu_production > pg-backup-$$(date +%Y%m%d_%H%M%S).sql

db-restore:
	@echo "Restore: cat backup.sql | docker exec -i \$$(docker-compose --env-file .env.production -f docker-compose.yml ps -q postgres) psql -U sinu -d sinu_production"