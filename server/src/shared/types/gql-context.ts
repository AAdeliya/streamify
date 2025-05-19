import { Request, Response } from 'express';

export interface GqlContext {
  req: Request & { session: Express.Session };
  res: Response;
}