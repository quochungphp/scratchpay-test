
git pull
docker stop api-server
docker rm api-server
docker build . -t api-server
docker run --name api-server -d -p 3111:3111 api-server
