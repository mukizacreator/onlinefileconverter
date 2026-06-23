# ============================================
# BASE IMAGE SETUP
# ============================================
# Uses a lightweight Node.js 18 environment for minimal container size
FROM node:18-slim

# ============================================
# SYSTEM DEPENDENCIES
# ============================================
# Updates package lists, installs required media and document processing tools, and cleans up cache to reduce image size
# - libreoffice: handles document conversions (Word, Excel, PowerPoint, PDF)
# - imagemagick: handles image format conversions and manipulations
# - ffmpeg: handles video and audio file conversions
RUN apt-get update && \
    apt-get install -y \
    libreoffice \
    imagemagick \
    ffmpeg && \
    rm -rf /var/lib/apt/lists/*

# ============================================
# APPLICATION ENVIRONMENT
# ============================================
# Sets the working directory inside the container where all subsequent commands will run
WORKDIR /app

# ============================================
# DEPENDENCY INSTALLATION
# ============================================
# Copies only package files first (to leverage Docker layer caching)
# If package.json hasn't changed, Docker reuses cached node_modules instead of reinstalling
COPY package*.json ./
RUN npm install

# ============================================
# APPLICATION SOURCE CODE
# ============================================
# Copies the remaining project files (source code, HTML, CSS, etc.) into the container
COPY . .

# ============================================
# NETWORK AND EXECUTION
# ============================================
# Exposes port 8080 to allow external access to the application
EXPOSE 8080
# Defines the startup command to run the Node.js server when container starts
CMD ["node", "server.js"]