FROM node:lts-alpine AS base

# Upgrade packages to patch vulnerabilities
RUN apk update && apk upgrade --no-cache

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy source code
COPY . .

CMD ["npx", "tsx", "workers/email.ts"]
