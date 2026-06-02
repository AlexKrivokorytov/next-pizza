import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export class ApiError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

export function withApiHandler(handler: Function) {
  return async (...args: any[]) => {
    try {
      return await handler(...args);
    } catch (error) {
      console.error('[API Error]:', error);
      
      if (error instanceof ZodError) {
        return NextResponse.json(
          { error: 'Validation Error', details: (error as any).errors },
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
