FROM node:latest
WORKDIR /app
COPY index.js /app
COPY package.json /app
ENTRYPOINT ["node", "index.js"]