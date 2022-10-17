import { NextFunction, Request, Response } from "express";

export class ValidationError extends Error {}
export class NotFoundError extends Error {}

export const handleError = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof ValidationError) {
    res.status(404).json({
      message: err.message,
    });
  }

  if (err instanceof NotFoundError) {
    res.status(500).json({
      message: "Sorry, try later.",
    });
  }

  console.error(err);
};
