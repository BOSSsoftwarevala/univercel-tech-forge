#!/usr/bin/env bash
set -euo pipefail

# Build and deploy softwarewala-frontend to Kubernetes
# Usage: ./deploy.sh [IMAGE_TAG]

IMAGE_NAME="softwarewala-frontend"
IMAGE_TAG="${1:-$(git rev-parse --short HEAD)}"
FULL_IMAGE="${IMAGE_NAME}:${IMAGE_TAG}"

echo "==> Building Docker image: ${FULL_IMAGE}"
docker build -t "${FULL_IMAGE}" -t "${IMAGE_NAME}:latest" .

echo "==> Importing image into k3s (if applicable)"
if command -v k3s &>/dev/null; then
  docker save "${FULL_IMAGE}" | k3s ctr images import -
fi

echo "==> Applying Kubernetes manifests"
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml

echo "==> Updating deployment image to ${FULL_IMAGE}"
kubectl set image deployment/softwarewala-frontend \
  softwarewala-frontend="${FULL_IMAGE}" \
  --namespace=default

echo "==> Waiting for rollout to complete"
kubectl rollout status deployment/softwarewala-frontend --namespace=default --timeout=120s

echo "==> Deployment complete"
kubectl get pods -l app=softwarewala-frontend --namespace=default
