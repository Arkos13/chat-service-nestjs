bash-node:
	docker exec -ti nestjs-app-node bash
build:
	docker exec -ti nestjs-app-node npm run build
drop-schema:
	docker exec nestjs-app-node npm run typeorm schema:drop -n
migration-run:
	docker exec nestjs-app-node npm run typeorm:run
fixtures:
	docker exec nestjs-app-node npm run fixtures
set-test-db: drop-schema migration-run fixtures