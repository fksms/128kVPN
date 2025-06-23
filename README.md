## How to deploy

### Linux (Ubuntu etc.)

#### Setup

Install Docker
```sh
curl https://get.docker.com | sudo sh
```

Load `ifb` and `act_mirred` module
```sh
sudo modprobe ifb
sudo modprobe act_mirred
```

Copy the `.env.sample` file and fill in the required information
```sh
cp .env.sample .env
```

#### Deploy

Build (Dev)
```sh
sudo docker compose -f compose.dev.yml up -d
sudo docker compose -f compose.dev.yml down
```

Build (Prod)
```sh
sudo docker compose up -d
sudo docker compose down
```

### MacOS

> [!IMPORTANT]
> The GUI works perfectly, but the VPN is not available.

#### Setup

Copy the `.env.sample` file and fill in the required information
```sh
cp .env.sample .env
```

#### Deploy

Build (Dev)
```sh
docker compose -f compose.dev.yml up -d
docker compose -f compose.dev.yml down
```