## How to deploy

### MacOS

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

#### Build

Copy the `.env.sample` file and fill in the required information
```sh
cp .env.sample .env
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