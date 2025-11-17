# Docker Deployment Guide

This guide covers deploying Seven of Nine Core using Docker and Docker Compose.

## Prerequisites

- Docker Engine 20.10+ ([Install Docker](https://docs.docker.com/get-docker/))
- Docker Compose 2.0+ ([Install Docker Compose](https://docs.docker.com/compose/install/))
- Recommended: 4GB RAM minimum, 8GB+ for optimal performance
- Optional: NVIDIA GPU + nvidia-docker for GPU-accelerated Ollama

## Quick Start

### Using Docker Compose (Recommended)

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f seven-core

# Stop services
docker-compose down

# Stop and remove volumes (complete reset)
docker-compose down -v
```

### Using Docker CLI Only

```bash
# Build the image
docker build -t seven-of-nine-core .

# Run the container
docker run -d \
  --name seven-core \
  -v $(pwd)/db:/app/db \
  -v $(pwd)/logs:/app/logs \
  -v $(pwd)/memory:/app/memory \
  seven-of-nine-core

# View logs
docker logs -f seven-core

# Stop and remove
docker stop seven-core && docker rm seven-core
```

## Architecture

The Docker setup includes:

1. **seven-core**: The main application container
   - Multi-stage build (build + runtime)
   - Node.js 20 Alpine base (~150MB final image)
   - Runs as non-root user for security
   - Persists data via volumes

2. **ollama** (optional): Local LLM service
   - Provides offline reasoning capabilities
   - Accessible at http://ollama:11434 from seven-core
   - Persists models in named volume

## Configuration

### Environment Variables

Configure via `docker-compose.yml` or `.env` file:

```yaml
environment:
  - NODE_ENV=production          # production | development
  - LOG_LEVEL=info              # debug | info | warn | error
  - OLLAMA_HOST=http://ollama:11434  # Ollama service URL
```

### Volumes

Data persistence is handled via volumes:

- `./db` - Database files (spark.db)
- `./logs` - Application logs
- `./memory` - Memory storage
- `ollama-data` - Ollama models (named volume)

## Ollama Setup

### Pull Models

After starting the services, pull your preferred model:

```bash
# List available models
docker exec -it seven-ollama ollama list

# Pull a model (e.g., llama2)
docker exec -it seven-ollama ollama pull llama2

# Or pull a specific version
docker exec -it seven-ollama ollama pull llama2:13b
```

### GPU Support (NVIDIA)

Uncomment the GPU configuration in `docker-compose.yml`:

```yaml
ollama:
  deploy:
    resources:
      reservations:
        devices:
          - driver: nvidia
            count: 1
            capabilities: [gpu]
```

Requires:
- NVIDIA GPU
- NVIDIA drivers
- [nvidia-container-toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html)

## Development Workflow

### Rebuild After Code Changes

```bash
# Rebuild and restart
docker-compose up -d --build

# Or rebuild specific service
docker-compose build seven-core
docker-compose up -d seven-core
```

### Interactive Shell

```bash
# Access container shell
docker exec -it seven-of-nine-core sh

# Run commands inside container
docker exec -it seven-of-nine-core node -e "console.log('test')"
```

### View Real-time Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f seven-core

# Last 100 lines
docker-compose logs --tail=100 seven-core
```

## Troubleshooting

### Container Won't Start

```bash
# Check container status
docker-compose ps

# View full logs
docker-compose logs seven-core

# Inspect container
docker inspect seven-of-nine-core
```

### Database Issues

```bash
# Reset database (WARNING: deletes all data)
docker-compose down
rm -rf ./db/*
docker-compose up -d

# Or run database initialization
docker exec -it seven-of-nine-core node db/init-spark-db.ts --reset
```

### Ollama Connection Issues

```bash
# Check if ollama is running
docker-compose ps ollama

# Test ollama connection
docker exec -it seven-core curl http://ollama:11434/api/version

# Check ollama logs
docker-compose logs ollama
```

### Build Failures

```bash
# Clean build (no cache)
docker-compose build --no-cache

# Check disk space
docker system df

# Clean up old images/containers
docker system prune -a
```

## Production Deployment

### Security Hardening

1. **Use secrets** for sensitive data (not environment variables)
2. **Enable resource limits** in docker-compose.yml:
   ```yaml
   seven-core:
     deploy:
       resources:
         limits:
           cpus: '2'
           memory: 4G
         reservations:
           memory: 2G
   ```

3. **Regular updates**:
   ```bash
   docker-compose pull
   docker-compose up -d
   ```

### Monitoring

Add health checks and monitoring:

```bash
# Check health status
docker inspect --format='{{.State.Health.Status}}' seven-of-nine-core

# View health check logs
docker inspect --format='{{range .State.Health.Log}}{{.Output}}{{end}}' seven-of-nine-core
```

### Backup

```bash
# Backup volumes
docker run --rm \
  -v $(pwd)/db:/source \
  -v $(pwd)/backups:/backup \
  alpine tar czf /backup/db-backup-$(date +%Y%m%d).tar.gz -C /source .

# Backup ollama models
docker run --rm \
  -v ollama-data:/source \
  -v $(pwd)/backups:/backup \
  alpine tar czf /backup/ollama-backup-$(date +%Y%m%d).tar.gz -C /source .
```

## Platform-Specific Notes

### Windows 11 (AMD)

- Ensure WSL2 is enabled and updated
- Use Docker Desktop with WSL2 backend
- Volume paths use forward slashes in docker-compose.yml
- Performance: Best with volumes on WSL2 filesystem

### Manjaro Linux (AMD)

- Install via package manager: `sudo pacman -S docker docker-compose`
- Enable service: `sudo systemctl enable --now docker`
- Add user to docker group: `sudo usermod -aG docker $USER`
- GPU support: Install `nvidia-docker` if using NVIDIA GPU

### Termux (Android)

Docker is not natively supported in Termux. For Android deployment:
- See `DEPLOYMENT.md` for Termux installation
- Or use a cloud deployment (Google Cloud Run)
- Or run Docker on a remote server and connect via SSH

## Next Steps

- [Google Cloud Run Deployment](./docs/gcp-deployment.md) (coming soon)
- [Windows Native Installation](./installers/windows/)
- [Linux Native Installation](./installers/linux/)
- [Android/Termux Installation](./installers/android/)

## Support

For issues or questions:
- Check [Troubleshooting](#troubleshooting) section above
- Review logs: `docker-compose logs -f`
- Create an issue on GitHub
