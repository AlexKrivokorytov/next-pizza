FROM node:22-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
# Install all dependencies (including dev for tsx)
RUN npm install

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

CMD ["npm", "run", "worker"]
