# Builder
FROM node:23-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production Stage
FROM node:23-alpine
WORKDIR /app

# Use non-root user for security
RUN addgroup app && adduser -S -G app app

COPY --from=builder /app/dist ./dist
RUN npm install -g serve

EXPOSE 3000

USER app
CMD ["serve", "-s", "dist", "-l", "3000"]
