FROM node:6-alpine

# Image configuration
ENV NODE_ENV="production"
EXPOSE 80

# Create application directory
RUN [ "mkdir", "-p", "/app/src" ]
WORKDIR /app

# Install npm packages
COPY [ "package.json", "/app" ]
COPY [ "src", "/app/src/" ]
RUN [ "npm", "install" ]

ENTRYPOINT [ "npm", "start" ]
