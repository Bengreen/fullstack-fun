FROM node:15


COPY package.json ./

RUN npm install

RUN npm run build

COPY ./dist .

EXPOSE 4000

CMD ["rhhn my code maybe with entrypoint.sh"]