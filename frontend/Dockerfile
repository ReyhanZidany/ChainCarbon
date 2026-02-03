# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Build arguments for Environment Variables
ARG REACT_APP_API_BASE_URL
ARG REACT_APP_STATIC_BASE_URL

ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL
ENV REACT_APP_STATIC_BASE_URL=$REACT_APP_STATIC_BASE_URL

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy build artifacts
COPY --from=builder /app/build /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
