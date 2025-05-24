FROM node:22-alpine

WORKDIR /usr/src/app

ARG NODE_ENV=development
ENV NODE_ENV=$NODE_ENV

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

# Use the environment-aware start script
CMD ["npm", "run", "start:env"]