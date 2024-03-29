FROM node

WORKDIR /app

COPY ./packages/db/package.json .
COPY ./packages/db/prisma ./prisma

RUN npm install

CMD ["npx", "prisma", "migrate", "deploy"]