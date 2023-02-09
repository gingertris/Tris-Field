FROM node:17-alpine AS base

FROM base as builder

WORKDIR /app

COPY package*.json tsconfig.build.json ./

COPY ./packages/db ./packages/db
COPY ./packages/services ./packages/services
COPY ./packages/bot ./packages/bot

RUN npm install

RUN npm run build

FROM base

WORKDIR /app

COPY --from=builder /app/packages/bot/build ./packages/bot
COPY --from=builder /app/packages/services/build ./packages/services
COPY --from=builder /app/packages/db/build ./packages/db

COPY --from=builder /app/package*.json .

COPY --from=builder /app/packages/bot/package*.json ./packages/bot/
COPY --from=builder /app/packages/services/package*.json ./packages/services/
COPY --from=builder /app/packages/db/package*.json ./packages/db/

COPY --from=builder /app/packages/db/prisma ./packages/db/

WORKDIR /app/bot

RUN npm ci --omit=dev

RUN npm run generate

WORKDIR /app/packages/bot

CMD ["node", "./app.js"]