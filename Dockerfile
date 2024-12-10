# Use an official Node.js runtime as a parent image
FROM node:14-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install -f

# Copy the app files to the working directory
COPY . .

# Build the Next.js app
RUN npm run build

# Expose the port the app runs on
EXPOSE 8080

# Command to run your application
CMD ["npm", "start"]

