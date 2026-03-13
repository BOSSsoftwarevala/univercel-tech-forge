# Dockerfile

# Stage 1: Build
FROM node:22-alpine AS builder

# Install only production-needed build tools
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy dependency manifests first for layer caching
COPY package*.json ./
RUN npm ci --ignore-scripts

# Copy source and build
COPY . .
RUN npm run build

# Stage 2: Production (hardened Nginx on unprivileged port 8080)
FROM nginx:1.27-alpine AS production

# Create a non-root group and user for nginx worker processes
RUN addgroup -g 1001 -S appgroup && \
    adduser  -u 1001 -S appuser -G appgroup

# Copy the built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Inject a minimal nginx config that listens on port 8080 (no root needed)
RUN printf 'server {\n\
    listen       8080;\n\
    server_name  _;\n\
    root         /usr/share/nginx/html;\n\
    index        index.html;\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
    # Security headers\n\
    add_header X-Frame-Options           "DENY";\n\
    add_header X-Content-Type-Options    "nosniff";\n\
    add_header Referrer-Policy           "no-referrer";\n\
    add_header Permissions-Policy        "camera=(), microphone=(), geolocation=()";\n\
}\n' > /etc/nginx/conf.d/default.conf

# Allow the nginx master (root) to write to run/cache dirs,
# and allow appuser to read the html files.
RUN chown -R appuser:appgroup /var/cache/nginx /var/log/nginx && \
    chmod -R 750 /usr/share/nginx/html

# Override the nginx.conf user directive so workers run as appuser
RUN sed -i 's/^user .*/user appuser appgroup;/' /etc/nginx/nginx.conf || true

# Health check (wget is available in nginx:alpine)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:8080/ || exit 1

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]