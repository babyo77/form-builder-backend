import { Response } from "express";
import { CustomRequest } from "../middleware/middleware";
import { ApiError } from "../handlers/ErrorHandler";
import { getFormPreview, getSubmission } from "../lib/utils";
import redisClient from "../lib/redis";

export const checkToken = async (
  req: CustomRequest,
  res: Response
): Promise<Response> => {
  const userId = req.userId;
  if (!userId) throw new ApiError("Refresh required", 401);
  const token =
    req.cookies.guest_token || req.headers.authorization?.split(" ")[1];
  const savedForm = await getFormPreview(userId);

  const submissions = await getSubmission(savedForm);

  const payload = {
    token,
    savedForm,
    submissions,
  };

  return res.json(payload);
};
