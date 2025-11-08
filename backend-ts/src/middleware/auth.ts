import { Request, Response, NextFunction } from 'express';

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.session.userId) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  next();
};

export const attachUser = (req: Request, _res: Response, next: NextFunction): void => {
  if (req.session.userId) {
    // User ID is available in session, can be used in routes
    next();
  } else {
    next();
  }
};
