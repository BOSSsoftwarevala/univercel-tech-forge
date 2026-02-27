# Dockerfile

# Use the official Node.js image.
FROM node:14

# Set the working directory.
WORKDIR /usr/src/app

# Install app dependencies.
COPY package*.json ./

# Install production and development dependencies.
RUN npm install

# Copy the rest of the application code.
COPY . .

# Build the application.
RUN npm run build

# Specify the command to run your app.
CMD [ "npm", "start" ]
