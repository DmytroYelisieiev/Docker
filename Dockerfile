FROM node:20.14-alpine
WORKDIR /app
COPY package*.json /app
RUN npm install
COPY src /app
COPY index.js /app
COPY knexfile.cjs /app
RUN mkdir -p migrations
CMD ["node", "index.js"]