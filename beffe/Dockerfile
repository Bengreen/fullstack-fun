FROM node:14 as BUILDENV
# Needs locale working to enable this
# RUN apt update \
#     && apt install -y tmux

WORKDIR /home/node

COPY package*.json ./

RUN npm install

COPY ts* ./
# Delete this in real systems
COPY *-config.yaml /home/node/


FROM BUILDENV as BUILD
COPY src/ src/

RUN npm run build



FROM node:14 as PUBLISH
WORKDIR /home/node

COPY package*.json ./
RUN npm install --production

COPY --from=BUILD /home/node/dist/ dist/
EXPOSE 4000


CMD [ "npm", "run", "server" ]
