FROM node:14-alpine

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./package.json
RUN npm install --silent
RUN npm install react-scripts -g --silent

COPY . ./

CMD ["npm", "run", "dev"]
