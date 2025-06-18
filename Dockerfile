FROM node:24-alpine
WORKDIR /opt/app
ADD package.json package.json
ADD tsconfig.json tsconfig.json
RUN npm install
ADD . .
RUN npm run build
RUN npn prune --production
CMD ["node", "./dist/main.js"]
