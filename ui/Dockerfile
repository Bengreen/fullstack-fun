FROM node as BUILD

RUN npm install -g @angular/cli

WORKDIR /home/node

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

FROM nginx as PUBLISH

COPY --from=build /home/node/dist/ui /usr/share/nginx/html

COPY nginx-templates /etc/nginx/templates/

