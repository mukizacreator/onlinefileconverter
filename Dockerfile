FROM node:18-slim

# Install dependencies
RUN apt-get update && apt-get install -y \
    libreoffice \
    libreoffice-writer \
    imagemagick \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Set environment variable for port
ENV PORT=10000
EXPOSE 10000

CMD ["node", "server.js"]