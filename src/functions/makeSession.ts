import { Response } from "express";
import { CustomRequest } from "../middleware/middleware";

import { makeGuestSession } from "../lib/utils";
export const makeSession = async (
  req: CustomRequest,
  res: Response
): Promise<Response> => {
  const guest_token =
    req.cookies.guest_token || req.headers.authorization?.split(" ")[1];
  if (guest_token) {
    return res.json({ token: guest_token });
  }
  const token = await makeGuestSession(res);
  return res.json({ token });
};
