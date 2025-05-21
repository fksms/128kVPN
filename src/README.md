## How to build

Install dependencies
```
npm install
```

Build (Dev)<br>
(For `XXXXXXXX`, specify any string that is difficult to guess.)
```
SECRET_API_KEY=XXXXXXXX npm run dev
```

Build (Prod)<br>
(For `XXXXXXXX`, specify any string that is difficult to guess.)
```
npm run build
SECRET_API_KEY=XXXXXXXX npm run start
```