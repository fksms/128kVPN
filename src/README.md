## How to build

Install dependencies
```sh
npm install
```

Build the `monitor.ts`
```sh
npm run build:monitor
```

Build (Dev)<br>
- `SECRET_API_KEY` is the access key for the management API. Please set it to a hard-to-guess string.
- `FIREBASE_ADMIN_*` is the Firebase Admin SDK configuration.
- `NEXT_PUBLIC_FIREBASE_CONFIG_*` is the Firebase Client SDK configuration.
```sh
BASE_URL='' \
PORT='' \
SECRET_API_KEY='' \
FIREBASE_ADMIN_PROJECT_ID='' \
FIREBASE_ADMIN_CLIENT_EMAIL='' \
FIREBASE_ADMIN_PRIVATE_KEY='' \
NEXT_PUBLIC_FIREBASE_CONFIG_API_KEY='' \
NEXT_PUBLIC_FIREBASE_CONFIG_AUTH_DOMAIN='' \
NEXT_PUBLIC_FIREBASE_CONFIG_PROJECT_ID='' \
NEXT_PUBLIC_FIREBASE_CONFIG_STORAGE_BUCKET='' \
NEXT_PUBLIC_FIREBASE_CONFIG_MESSAGING_SENDER_ID='' \
NEXT_PUBLIC_FIREBASE_CONFIG_APP_ID='' \
NEXT_PUBLIC_FIREBASE_CONFIG_MEASUREMENT_ID='' \
npm run dev
```

Build (Prod)<br>
- `SECRET_API_KEY` is the access key for the management API. Please set it to a hard-to-guess string.
- `FIREBASE_ADMIN_*` is the Firebase Admin SDK configuration.
- `NEXT_PUBLIC_FIREBASE_CONFIG_*` is the Firebase Client SDK configuration.
```sh
npm run build

BASE_URL='' \
PORT='' \
SECRET_API_KEY='' \
FIREBASE_ADMIN_PROJECT_ID='' \
FIREBASE_ADMIN_CLIENT_EMAIL='' \
FIREBASE_ADMIN_PRIVATE_KEY='' \
NEXT_PUBLIC_FIREBASE_CONFIG_API_KEY='' \
NEXT_PUBLIC_FIREBASE_CONFIG_AUTH_DOMAIN='' \
NEXT_PUBLIC_FIREBASE_CONFIG_PROJECT_ID='' \
NEXT_PUBLIC_FIREBASE_CONFIG_STORAGE_BUCKET='' \
NEXT_PUBLIC_FIREBASE_CONFIG_MESSAGING_SENDER_ID='' \
NEXT_PUBLIC_FIREBASE_CONFIG_APP_ID='' \
NEXT_PUBLIC_FIREBASE_CONFIG_MEASUREMENT_ID='' \
npm run start
```