import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      user?: {
        id: string;
        phone: string;
      };
    }
  }
}

export {};
