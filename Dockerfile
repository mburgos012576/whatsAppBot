FROM node:18-bullseye

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 4003

CMD ["node","start"]



