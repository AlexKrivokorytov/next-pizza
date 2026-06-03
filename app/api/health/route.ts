import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma-client';

export async function GET() {
  try {
    // Attempt a lightweight database query to check connection
    await prisma.$queryRaw`SELECT 1`;
    
    return NextResponse.json({ 
      status: 'ok', 
      db: 'connected', 
      version: '2.0.0',
      timestamp: new Date().toISOString()
    }, { status: 200 });
  } catch (error) {
    console.error('[HEALTH CHECK FAILED]:', error);
    
    return NextResponse.json({ 
      status: 'error', 
      db: 'disconnected', 
      version: '2.0.0',
      timestamp: new Date().toISOString()
    }, { status: 503 });
  }
}
