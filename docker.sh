DOCKER_TAG=$(cat package.json | jq -r '"kofoten/\(.name):\(.version)"')

docker build -t $DOCKER_TAG .
