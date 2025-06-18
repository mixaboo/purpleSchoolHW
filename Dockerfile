FROM node:24-alpine
WORKDIR /opt/app
ADD package.json package.json
RUN npm install
ADD . .
RUN npm run build
RUN npn prune --production
CMD ["node", "./dist/main.js"]
