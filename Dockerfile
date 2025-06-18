FROM node:22-alpine
WORKDIR /opt/app
COPY package*.json ./
RUN npm install
COPY . .
RUN node --version && npm --version
RUN ls -la
RUN npm run build --verbose
RUN npm prune --production
CMD ["node", "./dist/main.js"]
