# Stage 1: Build Frontend
FROM node:18-alpine as frontend-build

WORKDIR /app/frontend

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Build Backend & Serve
FROM python:3.10-slim

WORKDIR /app

# Install System Deps (if any needed for scipy/sklearn)
RUN apt-get update && apt-get install -y --no-install-recommends gcc python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy Backend Requirements
COPY backend-python/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy Backend Code
COPY backend-python/app ./app
COPY backend-python/.env.example ./.env

# Copy Frontend Build to Static Directory
COPY --from=frontend-build /app/frontend/dist ./static

# Expose Port
EXPOSE 8000

# Run Command
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
