import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface CustomRequest extends Request {
  userId?: string; // Adding a custom property for userId
}

export const publicAccess = async (
  req: CustomRequest,
  _res: Response,
  next: NextFunction
): Promise<any> => {
  const session =
    req.cookies.guest_token || req.headers.authorization?.split(" ")[1];

  const payload = jwt.verify(
    session,
    process.env.SECRET_KEY || ""
  ) as jwt.JwtPayload;
  if (payload) {
    req.userId = payload.userId;
  }

  next();
};
