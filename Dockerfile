FROM node:22-alpine3.19

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .

# Gera o Prisma Client (cria node_modules/.prisma/client)
RUN npx prisma generate

EXPOSE 5000
CMD ["npm", "run", "start"]
