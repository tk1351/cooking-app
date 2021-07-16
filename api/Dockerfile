FROM node:14.16.0 As production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /api

COPY package.json ./

RUN yarn install --only=production

COPY . .

COPY dist ./dist

CMD ["node", "dist/main"]