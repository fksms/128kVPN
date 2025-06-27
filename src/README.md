## How to deploy

### MacOS

> [!IMPORTANT]
> The GUI works perfectly, but the VPN is not available.

#### Setup

Install `nvm` and `wireguard-tools`
```sh
brew install nvm
brew install wireguard-tools
```

Setup `nvm`
```sh
nvm install stable --latest-npm
```

Copy the `.env.sample` file and fill in the required information
```sh
cp .env.sample .env
```

#### Build

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