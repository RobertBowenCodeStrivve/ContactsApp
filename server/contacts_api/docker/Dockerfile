
FROM alpine:latest
RUN apk add --no-cache nodejs npm 
# Copy in Common files in 
# What if I just copy everything in 
WORKDIR /app

# Install package.json and package-lock.json first to leverage Docker cache
COPY package.json ./
COPY package-lock.json ./

# Copy necessary workspace files
COPY server ./server
COPY common ./common

# Install dependencies for all workspaces and compile TypeScript
RUN npm run build

# Install dependencies and compile TypeScript, then remove unnecessary files
WORKDIR /app/server/contacts_api
RUN find . -maxdepth 1 -type d ! -name "." ! -name "out" ! -name "node_modules" -exec rm -rf {} +

EXPOSE 3000
# Command to run the application
CMD ["node", "./out/app.js"]

