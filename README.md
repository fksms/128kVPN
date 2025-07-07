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

Build only `app` (Prod)
```sh
sudo docker compose up -d app
sudo docker compose down
```

### MacOS and Windows

> [!IMPORTANT]
> The GUI works perfectly, but the VPN is not available.

#### Setup

Copy the `.env.sample` file and fill in the required information
```sh
cp .env.sample .env
```

Please start DevContainer.

#### Build

Change to the `src/` directory
```sh
cd src/
```

Install dependencies
```sh
npm install
```

Build (Dev)
```sh
npm run dev
```

Build (Prod)
```sh
npm run build
npm run start
```