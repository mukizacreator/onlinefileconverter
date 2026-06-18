FROM node:18-slim

# Install LibreOffice, fonts, and ffmpeg
RUN apt-get update && apt-get install -y \
    libreoffice-writer \
    libreoffice-common \
    fonts-liberation \
    imagemagick \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

ENV PORT=8080
EXPOSE 8080

CMD ["node", "server.js"]