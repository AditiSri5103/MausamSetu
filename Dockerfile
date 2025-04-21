FROM node:23-alpine

RUN mkdir -p /weather-app

WORKDIR /weather-app

COPY . /weather-app/

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]