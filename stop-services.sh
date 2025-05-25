#!/bin/bash

# Ask user about volumes
echo -n "Do you want to preserve volumes? (y/n): "
read preserve_volumes

# Set flags based on user input
if [[ "$preserve_volumes" =~ ^[Nn]$ ]]; then
    volume_flag="-v"
    echo "Volumes will be removed."
else
    volume_flag=""
    echo "Volumes will be preserved."
fi

# Stop services in manage-consents-sftp
echo "Stopping services in manage-consents-sftp..."
cd manage-consents-sftp
docker-compose down $volume_flag
cd ..

# Stop services in manage-inscriptions
echo "Stopping services in manage-inscriptions..."
cd manage-inscriptions
docker-compose down $volume_flag
cd ..

echo "All services have been stopped successfully!"