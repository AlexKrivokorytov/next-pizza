import path from 'node:path';
import { defineConfig } from 'prisma/config';

/**
 * Prisma configuration file (v7+).
 * Replaces the deprecated `prisma` key in package.json.
 * Connection URL is declared here instead of schema.prisma.
 */
export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
});
