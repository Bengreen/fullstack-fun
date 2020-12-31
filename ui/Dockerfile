FROM node:14 as BUILDENV

WORKDIR /home/node

RUN npm install -g @angular/cli

COPY package*.json ./

RUN npm install

COPY angular.json karma.conf.js tsconfig.* tslint.* proxy-config.js  ./

FROM BUILDENV as BUILD

COPY e2e/ e2e/
COPY src/ src/

RUN npm run build

FROM nginx as PUBLISH

COPY --from=build /home/node/dist/ui /usr/share/nginx/html
COPY nginx-htmlt /usr/share/nginx/htmlt

COPY nginx-templates /etc/nginx/templates/
COPY nginx-init /docker-entrypoint.d
