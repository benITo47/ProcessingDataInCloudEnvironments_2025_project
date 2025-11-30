# --- Stage 1: Build and Run the React application (Development Mode) ---
FROM --platform=linux/arm/v7 node:lts-alpine

WORKDIR /app

# Copy package.json and package-lock.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 3000, which is the default for React development server
EXPOSE 3000

# Command to run the React development server
CMD ["npm", "start"]

