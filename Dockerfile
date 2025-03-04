FROM node:20-alpine as base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine as production

ENV NODE_PATH=./dist
ENV PORT=8080

WORKDIR /app

COPY --from=base /app/package*.json ./
COPY --from=base /app/dist ./dist
COPY --from=base /app/.env ./

RUN npm install --only=production

EXPOSE 8080

CMD ["node", "./dist/index.js"]