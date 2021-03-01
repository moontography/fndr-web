# Base image
FROM node:14.16.0

LABEL AUTHOR="Lance Whatley"

WORKDIR /usr/fndr-web

# copy source, install, and build
COPY . .
RUN rm -rf node_modules
RUN npm install
RUN npm run build

CMD npm start