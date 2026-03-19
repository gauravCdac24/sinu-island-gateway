FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm i

# Copy all source code
COPY . .

# Expose ports
EXPOSE 3000 
EXPOSE 7000 

# Start Vite dev server (for staging/development)
CMD ["npm", "run", "dev", "--", "--host", "10.80.210.65", "--port", "3000"]