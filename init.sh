#!/bin/bash

# Create the shared network if it doesn't exist
echo "Creating shared Docker network if it doesn't exist..."
docker network create inscription-uptc-fit-network 2>/dev/null || true

# Ask user about building images
echo -n "Do you want to rebuild images? (y/n): "
read rebuild_images

# Set flags based on user input
if [[ "$rebuild_images" =~ ^[Yy]$ ]]; then
    build_flag="--build"
    echo "Images will be rebuilt."
else
    build_flag=""
    echo "Using existing images if available."
fi

# Start services in manage-consents-sftp
echo "Starting services in manage-consents-sftp..."
cd manage-consents-sftp
docker-compose up -d $build_flag
cd ..

# Start services in manage-inscriptions
echo "Starting services in manage-inscriptions..."
cd manage-inscriptions
docker-compose up -d $build_flag
cd ..

echo "All services have been started successfully!"