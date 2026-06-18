FROM node:18-slim

# Install Java (required for LibreOffice conversion filters) and other dependencies
RUN apt-get update && apt-get install -y \
    default-jre \
    libreoffice-writer \
    libreoffice-common \
    imagemagick \
    ffmpeg \
    fonts-liberation \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

ENV PORT=10000
EXPOSE 10000

CMD ["node", "server.js"]