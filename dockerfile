FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm i

# Copy all source code
COPY . .

# Build the Vite project (VITE_* must be set at build time for the client bundle)
ARG MODE=production
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build -- --mode $MODE

# Serve stage using Nginx
FROM nginx:alpine

RUN apk add --no-cache wget

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# The docker-compose files map the nginx configs
EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]