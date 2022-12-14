FROM node:18-alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g @nestjs/cli
RUN npm ci

COPY . .

RUN npm run build

FROM node:18-alpine AS production

ARG HD_MONGODB_CONNECTION_STRING_OS_USERS_DB
ARG HD_JWT_SECRET

ENV MONGODB_CONNECTION_STRING_OS_USERS_DB $HD_MONGODB_CONNECTION_STRING_OS_USERS_DB
ENV JWT_SECRET $HD_JWT_SECRET

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]
