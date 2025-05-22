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
(For `XXXXXXXX`, specify any string that is difficult to guess.)
```sh
BASE_URL=http://localhost \
PORT=3000 \
SECRET_API_KEY=XXXXXXXX \
npm run dev
```

Build (Prod)<br>
(For `XXXXXXXX`, specify any string that is difficult to guess.)
```sh
npm run build
BASE_URL=http://localhost \
PORT=3000 \
SECRET_API_KEY=XXXXXXXX \
npm run start
```