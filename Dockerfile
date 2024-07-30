FROM node:20.14
WORKDIR /app
COPY index.js /app
COPY package.json /app
RUN npm install
ENTRYPOINT ["node", "index.js"]