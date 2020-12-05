FROM node as BUILD

RUN npm install -g @angular/cli

COPY package.json .

RUN npm install

COPY .

RUN npm run build


FROM nginx

COPY --from build dist/ui /usr/share/nginx/html

COPY nginx-templates /etc/nginx/templates/

