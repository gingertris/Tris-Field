FROM node:17-alpine AS base

FROM base as builder

WORKDIR /app

COPY package*.json tsconfig.json ./

COPY ./packages/db ./packages/db
COPY ./packages/services ./packages/services
COPY ./packages/bot ./packages/bot

RUN npm install

RUN npm run generate

RUN npm run build

FROM base

WORKDIR /app

COPY --from=builder /app/build .

COPY --from=builder /app/build/db ./packages/db

COPY --from=builder /app/packages/bot/package*.json ./packages/bot/

WORKDIR /app/bot

RUN npm ci --omit=dev

CMD ["node", "./app.js"]