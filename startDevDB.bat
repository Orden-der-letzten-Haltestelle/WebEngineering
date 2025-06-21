docker-compose -f docker-compose.dev.yml -p webshop-dev down db
docker compose -f docker-compose.dev.yml -p webshop-dev up --build -d db