#!/bin/bash  
set -ev
HUBNAME=migruiz/$PI_APP
docker pull $HUBNAME || true
docker build -f Dockerfile --cache-from $HUBNAME  -t $HUBNAME  . 
echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin 
docker push $HUBNAME  