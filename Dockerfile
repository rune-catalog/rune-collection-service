FROM node:6-alpine

# Set env vars
ENV \
  NODE_ENV=production \
  CONTAINERPILOT_VERSION=2.1.2 \
  CONTAINERPILOT=file:///etc/containerpilot.json

# Install curl
RUN apk update && apk add curl

# Install ContainerPilot
RUN curl -Lso /tmp/containerpilot.tar.gz \
  "https://github.com/joyent/containerpilot/releases/download/${CONTAINERPILOT_VERSION}/containerpilot-${CONTAINERPILOT_VERSION}.tar.gz" \
  && tar -xzf /tmp/containerpilot.tar.gz -C /usr/local/bin \
  && rm /tmp/containerpilot.tar.gz
COPY containerpilot.json /etc/containerpilot.json

# Install app
RUN [ "mkdir", "-p", "/usr/local/app" ]
COPY [ "package.json", "/usr/local/app" ]
COPY [ ".", "/usr/local/app/" ]
WORKDIR /usr/local/app
RUN npm install

# Expose ports
EXPOSE 8080

# Start application
CMD [ "/usr/local/bin/containerpilot", "npm", "start" ]
