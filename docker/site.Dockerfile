FROM node:17-alpine AS base

FROM base as builder

WORKDIR /app

COPY package*.json tsconfig.build.json ./

COPY ./packages/db ./packages/db
COPY ./packages/services ./packages/services
COPY ./packages/site ./packages/site

RUN npm install

RUN npm run generate

RUN npm run build

FROM base

WORKDIR /app

COPY --from=builder /app/packages/site/build ./packages/site
COPY --from=builder /app/packages/services/build ./packages/services
COPY --from=builder /app/packages/db/build ./packages/db

COPY --from=builder /app/package*.json .

COPY --from=builder /app/packages/site/package*.json ./packages/site/
COPY --from=builder /app/packages/services/package*.json ./packages/services/
COPY --from=builder /app/packages/db/package*.json ./packages/db/

COPY --from=builder /app/packages/db/prisma ./packages/db/

RUN npm ci --omit=dev

RUN npm run generate

WORKDIR /app/packages/site

CMD ["node", "index.js"]