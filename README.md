## How to deploy

Copy the `.env.sample` file and fill in the required information
```sh
cp .env.sample .env
```

Build (Dev)
```
docker compose -f compose.dev.yml up -d
docker compose -f compose.dev.yml down
```

Build (Prod)
```
docker compose up -d
docker compose down
```