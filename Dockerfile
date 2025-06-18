FROM node:24-alpine
WORKDIR /opt/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm prune --production
CMD ["node", "./dist/main.js"]
