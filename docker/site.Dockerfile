FROM node AS base

FROM base as builder

WORKDIR /app

COPY package*.json tsconfig.build.json ./

COPY ./packages/site ./packages/site

RUN npm install


RUN npm run build-ci

FROM base

WORKDIR /app

COPY --from=builder /app/packages/site/build ./packages/site
COPY --from=builder /app/packages/site/package*.json ./packages/site/

COPY --from=builder /app/package*.json .


RUN npm ci --omit=dev

WORKDIR /app/packages/site

CMD ["node", "index.js"]