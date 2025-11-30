FROM --platform=linux/arm/v7 node:lts-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

EXPOSE 2067

CMD ["npm", "start"]
