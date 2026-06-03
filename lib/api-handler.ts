import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

export class ApiError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

export function withApiHandler(
  handler: (req: NextRequest, ...args: unknown[]) => Promise<NextResponse>
) {
  return async (req: NextRequest, ...args: unknown[]) => {
    try {
      return await handler(req, ...args);
    } catch (error) {
      console.error('[API Error]:', error);
      
      if (error instanceof ZodError) {
        return NextResponse.json(
          { error: 'Validation Error', details: error.issues },
          { status: 400 }
        );
      }
      
      if (error instanceof ApiError) {
        return NextResponse.json(
          { error: error.message },
          { status: error.statusCode }
        );
      }
      
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      );
    }
  };
}
