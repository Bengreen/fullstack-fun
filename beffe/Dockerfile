FROM node:14 as BUILD

WORKDIR /home/node

COPY package*.json ./

RUN npm install

COPY ts* ./
COPY src/ src/

RUN npm run build

FROM node:14 as PUBLISH
WORKDIR /home/node

COPY package*.json ./
RUN npm install --production

COPY --from=BUILD /home/node/dist/ dist/
EXPOSE 4000

CMD [ "npm", "run", "server" ]
