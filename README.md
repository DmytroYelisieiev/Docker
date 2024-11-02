# Docker


Use own credits at .env

<!-- npm i -->

docker-compose up --build

curl --location 'localhost:3000/title?id='

## FOR MIGRATION:

1. Make migration:

`docker exec -it docker-app-1 npx knex migrate:make 'task' --knexfile knexfile.cjs`
2. Download migration script

`docker cp docker-app-1:/app/migrations/'namejs'`

3. Change downloaded js script 
4. Upload migration script to container:

`docker exec -it docker-app-1 npx knex migrate:latest --knexfile knexfile.cjs`

5. Run migration:

`docker exec -it docker-app-1 npx knex migrate:latest --knexfile knexfile.cjs`