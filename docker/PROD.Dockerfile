#--------------------------------------STAGE 1-----------------------------
FROM node:22-alpine AS nodeServer

WORKDIR /app

# Install git for webpack build
RUN apk add --no-cache git

# Copy package files
COPY package*.json ./
COPY yarn.lock ./

# Install dependencies
RUN yarn install

# Copy source code
COPY . .

# Build the application
RUN yarn build:docker

# Expose port
EXPOSE 8081

# Start the application
CMD [ "yarn", "start" ]

#--------------------------------------STAGE 2-----------------------------
FROM nginx:alpine AS webServer

WORKDIR /app

# Copy built files from nodeServer stage
COPY --from=nodeServer /app/dist/ /app/dist/

# Copy nginx configuration
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]