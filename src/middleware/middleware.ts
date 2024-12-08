import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../handlers/ErrorHandler";

export interface CustomRequest extends Request {
  userId?: string; // Adding a custom property for userId
}

export const middleware = async (
  req: CustomRequest,
  _res: Response,
  next: NextFunction
): Promise<any> => {
  const session =
    req.cookies.guest_token || req.headers.authorization?.split(" ")[1];

  if (!session) throw new ApiError("Guest Session not found", 401);
  const payload = jwt.verify(
    session,
    process.env.SECRET_KEY || ""
  ) as jwt.JwtPayload;

  req.userId = payload.userId;

  next();
};
