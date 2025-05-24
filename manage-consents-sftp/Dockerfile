FROM node:18-alpine

# Crea el directorio de la app
WORKDIR /usr/src/app

# Copia solo package.json para cachear npm install
COPY package*.json ./
RUN npm install

# Copia el resto del código
COPY . .

# Puerto por defecto
EXPOSE 3000

CMD ["node", "index.js"]
