# Next Pizza v2.0 🍕

A full-stack pizza ordering platform built with modern web technologies, showcasing clean code architecture and advanced backend patterns.

![Pizza Showcase](./public/logo.png)

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: PostgreSQL with [Prisma ORM v7](https://www.prisma.io/) + `@prisma/adapter-pg`
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Validation**: [Zod](https://zod.dev/)

## Features

- **Product Catalog**: Browse pizzas, snacks, and drinks.
- **Advanced Filtering**: Filter by price range, pizza size, dough type, and ingredients.
- **Dynamic Sorting**: Sort products by popularity and price.
- **Customizable Pizzas**: Build your own pizza by toggling individual ingredients.
- **Shopping Cart**: Real-time cart updates and totals using Zustand.
- **Secure Checkout**: Form validation with Zod and secure order placement.
- **User Authentication**: Register and login securely using NextAuth.
- **User Profile**: View past orders and manage account details.

## Architecture

```mermaid
graph TD;
    Client[Next.js Client Components] --> Server[Next.js Server Actions / API Routes]
    Server --> Auth[NextAuth.js]
    Server --> Validation[Zod Validation]
    Validation --> DB_Layer[CategoryService / UsersService]
    DB_Layer --> Prisma[Prisma v7 ORM]
    Prisma --> PG[(PostgreSQL)]
```

## Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js 22+ (for local development without Docker)

### 1. Run with Docker Compose (Recommended)

The easiest way to get the app running, including the database and seed data.

```bash
docker-compose up -d --build
```
This will start:
- Next.js Web App at `http://localhost:3000`
- PostgreSQL Database at `localhost:5433`

### 2. Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy environment file:
   ```bash
   cp .env.example .env
   # Make sure DATABASE_URL points to postgresql://postgres:postgres@localhost:5433/next-pizza?schema=public
   ```

3. Generate Prisma Client & Push Schema:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. Seed the database:
   ```bash
   npm run prisma:seed
   ```

5. Run development server:
   ```bash
   npm run dev
   ```

## Design Patterns

- **Clean Code**: Components are decoupled, and functions follow SRP (Single Responsibility Principle). Max component size kept small via decomposition.
- **Centralized Providers**: All context providers grouped in `providers/index.tsx`.
- **API Error Handling**: Uses a robust higher-order `withApiHandler` wrapper in `lib/api-handler.ts`.
- **Driver Adapters**: Utilizing Prisma's newer `@prisma/adapter-pg` pattern for serverless edge compatibility.

## CI/CD

Configured via GitHub Actions:
- Type checking (`tsc --noEmit`)
- Linting (`eslint`)
- Build verification
- Docker `HEALTHCHECK` mapped to `/api/health`
