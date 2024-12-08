import { Response } from "express";
import { CustomRequest } from "../middleware/middleware";
import { ApiError } from "../handlers/ErrorHandler";
import { getFormPreview, getPreviousSubmitted } from "../lib/utils";

export const previewForm = async (
  req: CustomRequest,
  res: Response
): Promise<Response> => {
  const userId = req.userId;
  const formId = req.headers.form || req.cookies.guest_form;

  if (!userId) throw new ApiError("Login required", 401);
  const savedForm = await getFormPreview(userId);
  const prevSubmitted = await getPreviousSubmitted(userId, formId);

  return res.json({ savedForm, prevSubmitted });
};
