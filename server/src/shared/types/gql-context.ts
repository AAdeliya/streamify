import { Request, Response } from 'express';

// Extend Request to include session if not already included
declare module 'express' {
  interface SessionData {
    createdAt: Date;
    userId: string;
  }
}

export interface GqlContext {
  req: Request;
  res: Response;
}