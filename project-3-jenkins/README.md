# Project 3 — CI/CD with Jenkins, Docker, and Kubernetes

This project automates the release of Plateful from a Git repository to the local Minikube Kubernetes cluster.

```text
GitHub push → Jenkins checkout → npm test → Docker build → Minikube image load → Kubernetes rolling deployment
```

## What is included

- `Jenkinsfile`: pipeline definition executed by Jenkins.
- `jenkins/Dockerfile`: Jenkins image with Node.js, Docker CLI, kubectl, and Minikube CLI.
- `docker-compose.yml`: local Jenkins environment for WSL.
- Node.js API tests in `project-1-docker/test/server.test.js`.

## 1. Confirm local prerequisites in WSL

Docker Desktop must be running and your Minikube cluster must be started.

```bash
docker version
minikube status
kubectl get nodes
```

The Jenkins container uses your Docker socket and read-only Kubernetes / Minikube configuration. The compose file assumes your WSL username is `gokul`; if `echo $HOME` is not `/home/gokul`, change `/home/gokul` in `docker-compose.yml` to your WSL home path.

## 2. Start Jenkins

```bash
cd /mnt/e/Project/project-3-jenkins
docker compose up -d --build
docker compose logs -f jenkins
```

Get the one-time unlock password:

```bash
docker exec jenkins-devops cat /var/jenkins_home/secrets/initialAdminPassword
```

Open http://localhost:8080, paste the password, choose **Install suggested plugins**, and create the first admin user.

## 3. Create and publish the GitHub repository

From the workspace root:

```bash
cd /mnt/e/Project
git init
git add .
git commit -m "Build Docker and Kubernetes DevOps projects"
git branch -M main
```

Create an empty GitHub repository named `aws-devops-practice-projects` in your GitHub account. Then connect and push it (replace the URL):

```bash
git remote add origin https://github.com/YOUR-USERNAME/aws-devops-practice-projects.git
git push -u origin main
```

Use a GitHub personal access token when GitHub asks for a password; do not put the token in this repository or Jenkinsfile.

## 4. Create the Jenkins Pipeline job

1. In Jenkins select **New Item** → enter `plateful-cicd` → select **Pipeline** → **OK**.
2. Under **Pipeline**, select **Pipeline script from SCM**.
3. SCM: **Git**. Enter your repository URL and add GitHub credentials if it is private.
4. Branch: `*/main`.
5. Script Path: `project-3-jenkins/Jenkinsfile`.
6. Save, then select **Build Now**.

The first run creates the Kubernetes Deployment (if needed), then deploys an image tagged with the Jenkins build number, for example `my-devops-app:1`.

## 5. Trigger an update

Change any project file, commit, and push:

```bash
git add project-1-docker/public/index.html
git commit -m "Update home page copy"
git push
```

Select **Build Now** in Jenkins for now. Later, configure a GitHub webhook to trigger the job automatically.

## Pipeline stages

| Stage | Purpose |
| --- | --- |
| Checkout | Retrieves the selected Git revision. |
| Install dependencies | Installs Node.js dependencies. |
| Test | Tests the health and restaurant API endpoints. |
| Build Docker image | Creates a uniquely tagged image using `BUILD_NUMBER`. |
| Load image into Minikube | Makes that image available to the local cluster. |
| Deploy to Kubernetes | Updates the Deployment and waits for a successful rolling update. |

## Troubleshooting

```bash
# Jenkins logs
docker compose logs -f jenkins

# Check current application release
kubectl get deployment plateful -o jsonpath='{.spec.template.spec.containers[0].image}'
echo

# Pipeline deployment failures
kubectl get pods -l app=plateful
kubectl describe deployment plateful
kubectl logs -l app=plateful --prefix
```

If Jenkins cannot access Docker, check that `/var/run/docker.sock` exists in WSL and restart the Jenkins container after Docker Desktop is running.

## Security note

Mounting the Docker socket gives Jenkins extensive local Docker access. This setup is appropriate for a personal learning environment only. Production CI uses restricted build agents, managed credentials, an image registry, and separate deployment permissions.
