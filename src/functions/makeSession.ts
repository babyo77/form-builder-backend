import { Response } from "express";
import { CustomRequest } from "../middleware/middleware";
import { GuestSession } from "../models/guestUserModel";
import jwt from "jsonwebtoken";
import { makeGuestSession } from "../lib/utils";
export const makeSession = async (
  req: CustomRequest,
  res: Response
): Promise<Response> => {
  const guest_token = req.cookies.guest_token;
  if (guest_token) {
    return res.json({ token: guest_token });
  }
  const token = await makeGuestSession(res);
  return res.json({ token });
};
