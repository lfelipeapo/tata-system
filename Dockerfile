FROM node:14-alpine

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
RUN npm install
RUN npm install react-scripts@latest -g --silent

COPY . ./

CMD ["npm", "run", "dev"]
