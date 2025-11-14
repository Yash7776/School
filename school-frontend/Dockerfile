# Stage 1: Build Vite React app
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build   # Vite outputs to /app/dist


# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy build output to Nginx folder
COPY --from=build /app/dist /usr/share/nginx/html

# Replace Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
