FROM node:14.16.1 As development

WORKDIR /usr/src/app

RUN rm -rf node_modules package-lock.json

COPY package*.json ./

RUN npm install glob rimraf

RUN npm ci

COPY . .

RUN npm run build && npm prune --production --loglevel verbose


FROM node:14.16.1 As production

ENV NODE_ENV=production

WORKDIR /usr/src/app

EXPOSE 3111

COPY --from=development /usr/src/app ./

CMD ["npm", "run", "start:prod"]