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

### MacOS and Windows

> [!IMPORTANT]
> The GUI works perfectly, but the VPN is not available.

#### Setup

Please start DevContainer.

#### Build

Copy the `.env.sample` file and fill in the required information
```sh
cp .env.sample .env
```

Copy the `.env` file into the `src/`
```sh
cp .env src/
```

Run `entrypoint.dev.sh`
```sh
bash entrypoint.dev.sh
```

Change to the `src/` directory
```sh
cd src/
```

Install dependencies
```sh
npm install
```

Build (Dev)<br>
```sh
npm run dev
```

Build (Prod)<br>
```sh
npm run build
npm run start
```