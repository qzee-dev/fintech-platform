.PHONY: help build start stop logs clean deploy-docker deploy-k8s migrate seed

# Colors for output
RED := \033[0;31m
GREEN := \033[0;32m
YELLOW := \033[0;33m
NC := \033[0m # No Color

help:
	@echo "$(GREEN)Fintech Platform - Make Commands$(NC)"
	@echo ""
	@echo "Development:"
	@echo "  $(YELLOW)make start$(NC)           - Start all services with docker-compose"
	@echo "  $(YELLOW)make stop$(NC)            - Stop all services"
	@echo "  $(YELLOW)make logs$(NC)            - View service logs"
	@echo "  $(YELLOW)make ps$(NC)              - Show running containers"
	@echo ""
	@echo "Database:"
	@echo "  $(YELLOW)make migrate$(NC)         - Run database migrations"
	@echo "  $(YELLOW)make seed$(NC)            - Seed demo data"
	@echo ""
	@echo "Building:"
	@echo "  $(YELLOW)make build-all$(NC)       - Build all service images"
	@echo "  $(YELLOW)make build-service$(NC)   - Build specific service (SERVICE=service-name)"
	@echo ""
	@echo "Testing:"
	@echo "  $(YELLOW)make test$(NC)            - Run all tests"
	@echo "  $(YELLOW)make test-service$(NC)    - Test specific service"
	@echo ""
	@echo "Deployment:"
	@echo "  $(YELLOW)make deploy-docker$(NC)   - Deploy to Docker"
	@echo "  $(YELLOW)make deploy-k8s$(NC)      - Deploy to Kubernetes"
	@echo ""
	@echo "Cleanup:"
	@echo "  $(YELLOW)make clean$(NC)           - Clean up containers and volumes"

# Development targets
start:
	@echo "$(GREEN)Starting fintech platform...$(NC)"
	docker-compose up -d
	@echo "$(GREEN)Services starting. Check status with 'make ps'$(NC)"

stop:
	@echo "$(GREEN)Stopping fintech platform...$(NC)"
	docker-compose down

ps:
	docker-compose ps

logs:
	docker-compose logs -f

logs-service:
	docker-compose logs -f $(SERVICE)

restart:
	docker-compose restart

restart-service:
	docker-compose restart $(SERVICE)

# Database targets
migrate:
	@echo "$(GREEN)Running database migrations...$(NC)"
	./scripts/migrate-db.sh

seed:
	@echo "$(GREEN)Seeding demo data...$(NC)"
	./scripts/seed-data.sh

# Build targets
build-all:
	@echo "$(GREEN)Building all service images...$(NC)"
	docker-compose build

build-service:
	@echo "$(GREEN)Building $(SERVICE) image...$(NC)"
	docker-compose build $(SERVICE)

# Testing targets
test:
	@echo "$(GREEN)Running all tests...$(NC)"
	docker-compose run --rm user-service npm test
	docker-compose run --rm wallet-service npm test
	docker-compose run --rm transaction-service npm test

test-service:
	@echo "$(GREEN)Testing $(SERVICE)...$(NC)"
	docker-compose run --rm $(SERVICE) npm test

# Deployment targets
deploy-docker:
	@echo "$(GREEN)Deploying to Docker...$(NC)"
	docker-compose -f docker-compose.yaml -f docker-compose.prod.yaml up -d

deploy-k8s:
	@echo "$(GREEN)Deploying to Kubernetes...$(NC)"
	kubectl apply -f k8s/namespaces.yaml
	kubectl apply -f k8s/base/
	kubectl apply -f k8s/services/

status-k8s:
	kubectl get pods -n fintech
	logs-k8s:
	kubectl logs -f -n fintech -l app=fintech

# Cleanup
clean:
	@echo "$(RED)Cleaning up...$(NC)"
	docker-compose down -v
	@echo "$(GREEN)Cleanup complete$(NC)"

clean-hard:
	@echo "$(RED)Hard clean - removing all Docker resources...$(NC)"
	docker system prune -af

# Development utilities
shell-db:
	docker-compose exec postgres psql -U fintech_user -d fintech_db

shell-redis:
	docker-compose exec redis redis-cli

shell-service:
	docker-compose exec $(SERVICE) /bin/bash

# Load testing
load-test:
	@echo "$(GREEN)Running load tests...$(NC)"
	./scripts/load-test.sh
