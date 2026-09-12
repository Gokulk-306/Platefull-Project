# Project 1 — Dockerized Node.js Food Delivery App

This project packages **Plateful**, an interactive Node.js food-delivery demo, in Docker. It has a responsive restaurant interface, search and cuisine filtering, a small REST API, and a working shopping bag—all without an AWS account.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) running

## Run it

From this directory:

```powershell
docker build -t my-devops-app .
docker run -d --name my-devops-app -p 5000:5000 my-devops-app
```

Visit http://localhost:5000. Search restaurants, filter by cuisine, and add items to the bag.

## Troubleshooting practice

```powershell
# See running and stopped containers
docker ps -a

# View application logs
docker logs my-devops-app

# Stop and restart the existing container
docker stop my-devops-app
docker start my-devops-app

# After editing app.py, remove the old container and rebuild
docker stop my-devops-app
docker rm my-devops-app
docker build -t my-devops-app .
docker run -d --name my-devops-app -p 5000:5000 my-devops-app
```

If port 5000 is already in use, replace the host side of the mapping, for example `-p 5001:5000`, then open http://localhost:5001.
