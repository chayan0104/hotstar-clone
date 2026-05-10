# Hotstar Clone

A React-based frontend clone of the Hotstar streaming UI backed by The Movie Database (TMDB) API. This repository also includes DevOps automation for containerization, continuous integration, security scanning, and deployment.

## 🚀 Project Overview

This project is a Hotstar-like media browsing interface built with React. It fetches movie and TV show data from TMDB and renders:

- Featured banner section
- Movie category rows
- Genre and language components
- Platform and discovery UI elements
- Responsive navigation and footer

The repository also includes:

- `Dockerfile` for containerizing the React app
- `nginx.conf` for NGINX static site serving
- `Jenkinsfile` CI/CD pipeline with SonarQube, OWASP Dependency Check, and Trivy scanning
- Kubernetes manifest in `K8S/manifest.yml`
- AWS Terraform infrastructure in `Terraform/main.tf`
- Deployment helper scripts in `scripts/`

## 🧩 Tech Stack

- React 18
- Axios
- React Scripts
- NGINX
- Docker
- Jenkins
- SonarQube
- OWASP Dependency Check
- Trivy
- Kubernetes
- Terraform

## 📁 Repository Structure

- `src/` — React frontend source
- `public/` — Static web assets
- `Dockerfile` — Multi-stage build for production image
- `nginx.conf` — NGINX configuration for serving the build
- `Jenkinsfile` — Pipeline for CI/CD, scanning, image build, push, and deploy
- `K8S/manifest.yml` — Kubernetes Deployment and Service
- `Terraform/` — AWS EC2 provisioning configuration
- `scripts/` — Automation scripts for Docker and related setup

## ⚙️ Getting Started

### Prerequisites

- Node.js 18+ / npm
- Docker
- Git

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm start
```

The app will start in development mode and open at `http://localhost:3000`.

### Build for production

```bash
npm run build
```

### Run with Docker

```bash
docker build -t hotstar-clone .
docker run -d -p 3000:3000 --name hotstar-clone hotstar-clone
```

Then open `http://localhost:3000`.

## 🔧 TMDB API Configuration

The frontend uses TMDB endpoints through `src/tmdbAxiosInstance.js`.

Current fetch paths are defined in `src/request.jsx` and use an embedded API key.

If you want to use your own TMDB API key, update the `APIKEY` constant in `src/request.jsx`.

## 📦 CI/CD & Deployment

### Jenkins Pipeline

The included `Jenkinsfile` performs:

- Git checkout
- `npm ci` and production build
- SonarQube analysis
- Quality gate validation
- OWASP Dependency Check
- Trivy filesystem and image scans
- Docker image build and push
- Container deployment

### Kubernetes Deployment

Use `K8S/manifest.yml` to deploy the app as a Kubernetes Deployment + LoadBalancer Service.

### AWS Provisioning

Use the Terraform files in `Terraform/` to provision an EC2 instance and security group in AWS.

## 📝 Notes

- This is a frontend clone and not an official Hotstar product.
- The project is designed for learning purposes and for demonstrating a React UI with a DevOps pipeline.
- The Dockerfile serves the production build via NGINX on port `3000`.

## 📌 Useful Commands

- `npm install`
- `npm start`
- `npm run build`
- `docker build -t hotstar-clone .`
- `docker run -p 3000:3000 hotstar-clone`

## 📜 License

This repository does not include a license file. Use and modify it for educational and demo purposes.
