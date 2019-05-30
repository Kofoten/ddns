FROM node:11.11.0-alpine
WORKDIR /app
ADD . /app
RUN npm install --production
CMD npm run start
