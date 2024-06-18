# Stage 1: Build the application
FROM node:16-alpine AS builder

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all the source files
COPY . .

# Build the application (if applicable, e.g., for front-end projects)
# RUN npm run build

# Stage 2: Create a smaller image for running the application
FROM node:16-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy only the necessary files from the build stage
COPY --from=builder /usr/src/app .

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "app.js"]
