#!/bin/bash
cd /var/www/sinu-island-gateway

echo "🚀 Deploying Sinu Island Gateway to 10.80.210.65:3000"

# Stop and remove existing containers
echo "🔧 Stopping existing containers..."
docker-compose --env-file .env.staging -f docker-compose-staging.yml down -v 2>/dev/null || true

# Remove old images
echo "🧹 Cleaning up old images..."
docker rmi -f sinu-app 2>/dev/null || true

# Remove node_modules to avoid conflicts
echo "📦 Cleaning node_modules..."
rm -rf node_modules package-lock.json

# Create .env.staging if missing
if [ ! -f ".env.staging" ]; then
    echo "📝 Creating .env.staging..."
    cat > .env.staging << 'EOF'
NODE_ENV=staging
PORT=3000
HOST=10.80.210.65
VITE_APP_NAME=Sinu Island Gateway
EOF
fi

# Build the Docker image
echo "🔨 Building Docker image..."
docker-compose --env-file .env.staging -f docker-compose-staging.yml build --no-cache

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Trying alternative approach..."
    docker build -t sinu-app .
fi

# Start the container
echo "⚡ Starting container..."
docker-compose --env-file .env.staging -f docker-compose-staging.yml up -d

# Wait for app to start
echo "⏳ Waiting for app to start..."
sleep 10

# Check if container is running
echo "📊 Checking container status..."
if docker ps | grep -q sinu-app; then
    echo "✅ Container is running!"
else
    echo "❌ Container failed to start. Checking logs..."
    docker-compose --env-file .env.staging -f docker-compose-staging.yml logs app
    exit 1
fi

# Test the connection
echo "🌐 Testing connection..."
if curl -s -o /dev/null -w "%{http_code}" http://10.80.210.65:3000 | grep -q "200\|304"; then
    echo "✅ App is accessible at http://10.80.210.65:3000"
else
    echo "⚠️  App might be starting. Checking logs..."
    docker-compose --env-file .env.staging -f docker-compose-staging.yml logs app --tail=20
fi

echo ""
echo "🎉 Deployment complete!"
echo "🌐 Access your app at: http://10.80.210.65:3000"
echo ""
echo "📋 Useful commands:"
echo "   View logs: docker-compose --env-file .env.staging -f docker-compose-staging.yml logs -f app"
echo "   Stop app: docker-compose --env-file .env.staging -f docker-compose-staging.yml down"
echo "   Restart: docker-compose --env-file .env.staging -f docker-compose-staging.yml restart app"
echo ""
echo "🔧 To check if the port is accessible from other machines:"
echo "   From another machine: curl http://10.80.210.65:3000"