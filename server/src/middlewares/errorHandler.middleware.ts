import { Request, Response, NextFunction } from 'express';

interface Error {
  status?: number;
  message: string;
}

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;
  const message = err.message || 'Server error';
  res.status(status).json({ success: false, message });
};
