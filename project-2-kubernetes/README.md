# Project 2 — Deploy Plateful on Kubernetes

Deploy the Dockerized Node.js food-delivery application from Project 1 into a **local Kubernetes cluster**. No AWS account is required.

## What you will practise

- Deployment: maintains the requested number of application pods.
- Service: provides one stable network endpoint for all pods.
- Replicas and scaling.
- Rolling updates with no manual stop/start cycle.
- Health checks and pod troubleshooting.

## Prerequisites (WSL)

- Docker Desktop running, with WSL integration enabled.
- `kubectl` installed: `kubectl version --client`
- Minikube installed: `minikube version`

Start a local cluster if needed:

```bash
minikube start --driver=docker
```

## 1. Build and load the application image

From Project 1, build the Docker image and make it available to Minikube:

```bash
cd /mnt/e/Project/project-1-docker
docker build -t my-devops-app:latest .
minikube image load my-devops-app:latest
```

> Run `minikube image load` after each new image build. It copies the local Docker image into Minikube's image store.

## 2. Deploy to Kubernetes

```bash
cd /mnt/e/Project/project-2-kubernetes
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl get deployments
kubectl get pods
kubectl get service
```

Wait until all three pods are `Running` and `READY 1/1`.

## 3. Open the application

Run this command and keep its terminal open:

```bash
minikube service plateful-service --url
```

Open the URL it prints. Alternatively, use port forwarding:

```bash
kubectl port-forward service/plateful-service 5000:80
```

Then open http://localhost:5000.

## 4. Scale the application

```bash
kubectl scale deployment plateful --replicas=5
kubectl get pods
```

Return to three replicas:

```bash
kubectl scale deployment plateful --replicas=3
```

## 5. Update with a rolling deployment

1. Change the application in `project-1-docker` (for example, a restaurant name or heading).
2. Build and load a versioned image:

```bash
cd /mnt/e/Project/project-1-docker
docker build -t my-devops-app:v2 .
minikube image load my-devops-app:v2
```

3. Tell Kubernetes to use it and watch the rolling update:

```bash
kubectl set image deployment/plateful plateful=my-devops-app:v2
kubectl rollout status deployment/plateful
kubectl get pods
```

Kubernetes creates new healthy pods before it removes old ones. The `readinessProbe` prevents an unready application pod from receiving traffic.

## Troubleshooting

```bash
# Detailed pod state and recent events
kubectl describe pod <pod-name>

# Application logs for every Plateful pod
kubectl logs -l app=plateful --prefix

# Follow one pod's logs in real time
kubectl logs -f <pod-name>

# Inspect the deployment and service
kubectl describe deployment plateful
kubectl describe service plateful-service

# See the full cluster status
kubectl get all
```

Common issues:

- `ImagePullBackOff`: run `minikube image load my-devops-app:latest`, then delete the failing pod so Kubernetes recreates it.
- `CrashLoopBackOff`: inspect `kubectl logs <pod-name>` and ensure the server listens on `0.0.0.0:5000`.
- `0/1 READY`: check `kubectl describe pod <pod-name>`; the `/health` readiness check must return HTTP 200.

## Clean up

```bash
kubectl delete -f service.yaml
kubectl delete -f deployment.yaml
```
