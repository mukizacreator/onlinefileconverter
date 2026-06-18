FROM node:18-slim

# Install core conversion tools
RUN apt-get update && apt-get install -y libreoffice-writer libreoffice-common && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

ENV PORT=10000
EXPOSE 10000

# Use direct execution to avoid path issues
CMD ["node", "server.js"]