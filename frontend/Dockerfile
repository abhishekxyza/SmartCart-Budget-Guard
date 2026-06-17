FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install --legacy-peer-deps

# Copy source
COPY frontend/ .

EXPOSE 3000

CMD ["npm", "start"]
