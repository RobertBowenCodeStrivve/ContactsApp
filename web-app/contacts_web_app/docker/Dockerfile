
FROM alpine:latest
RUN apk add --no-cache nodejs npm 

WORKDIR /app
# Install package.json and package-lock.json first to leverage Docker cache
COPY package.json ./
COPY package-lock.json ./

# Copy necessary workspace files
COPY web-app ./web-app
# Install dependencies for all workspaces and compile TypeScript
RUN npm run build

# Install dependencies and compile TypeScript, then remove unnecessary files
WORKDIR /app/web-app/contacts_web_app
RUN find . -maxdepth 1 -type d ! -name "." ! -name "dist" ! -name "node_modules" -exec rm -rf {} +


# Expose port
EXPOSE 4173

# Start the preview server
CMD ["npm", "run", "preview", "--", "--host"]