# Use an official Node.js runtime as a parent image
FROM node:20-alpine AS development

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json tsconfig.json vite.config.ts ./
RUN npm ci

COPY src ./src
RUN npm run build

FROM node:alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
# Copy the rest of the application code
COPY --from=development /app/dist ./dist

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the application
CMD ["node", "dist/index.js"]