import { Response } from "express";
import { CustomRequest } from "../middleware/middleware";
import { ApiError } from "../handlers/ErrorHandler";
import {
  getFromDataById,
  getPreviousSubmitted,
  makeGuestSession,
} from "../lib/utils";
import jwt from "jsonwebtoken";
import { memoryCache } from "../cache/cache";
export const getFromData = async (
  req: CustomRequest,
  res: Response
): Promise<Response> => {
  const formId = req.params.id;
  let userId = req.userId;
  if (!formId) throw new ApiError("Form id must be provided", 400);

  if (!userId) {
    const token = await makeGuestSession(res);
    const payload = jwt.verify(
      token,
      process.env.SECRET_KEY || ""
    ) as jwt.JwtPayload;

    userId = payload.userId;
  }

  const savedForm = await getFromDataById(formId);

  const prevSubmitted = userId
    ? await getPreviousSubmitted(userId, formId)
    : null;

  if (savedForm.publish) {
    return res.json({ savedForm, prevSubmitted });
  }
  if (!savedForm.publish && String(userId) == String(savedForm.owner)) {
    return res.json({ savedForm, prevSubmitted });
  }
  throw new ApiError("Form not published yet!", 403);
};
