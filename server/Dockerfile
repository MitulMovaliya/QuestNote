# Use Node.js 20
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy server code
COPY . .

# Heroku sets PORT automatically
EXPOSE $PORT

# Start server
CMD ["npm", "start"]
