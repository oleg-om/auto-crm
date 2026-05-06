#--------------------------------------STAGE 1-----------------------------
FROM node:12-buster AS node_server
CMD [ "yarn","start" ]
WORKDIR /app
COPY package*.json yarn.lock ./
RUN npm config set scripts-prepend-node-path true && yarn install --frozen-lockfile
COPY . .
RUN yarn build
#--------------------------------------STAGE 2-----------------------------
FROM nginx:alpine AS web_server
WORKDIR /app
COPY --from=node_server /app/dist/ /app/public/
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
