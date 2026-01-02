# Development stage
FROM node:20-alpine AS development
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy ALL source files (not just src/)
COPY . .                 

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine AS production
COPY --from=development /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]