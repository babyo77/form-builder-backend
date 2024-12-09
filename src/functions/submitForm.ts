import { Response } from "express";
import { CustomRequest } from "../middleware/middleware";
import { ApiError } from "../handlers/ErrorHandler";
import validateFormSubmission from "../validation/formSubmissionValidation";
import { getFromDataById } from "../lib/utils";
import FormSubmitted from "../models/formSubmitMode";

import redisClient from "../lib/redis";
import { memoryCache } from "../cache/cache";
export const submitForm = async (
  req: CustomRequest,
  res: Response
): Promise<Response> => {
  const userId = req.userId;
  const formId = req.params.id;
  const answer = req.body;
  if (!answer) throw new ApiError("Invalid answer", 400);
  if (!userId) throw new ApiError("Login required", 401);
  const savedForm = await getFromDataById(formId);
  const validate = validateFormSubmission(savedForm.questions, answer);
  if (validate.errors)
    throw new ApiError("Invalid submission", 400, validate.errors);
  const formSubmitted = await FormSubmitted.findOneAndUpdate(
    { userId, formId },
    {
      userId,
      formId,
      submittedQuestions: answer,
    },
    { upsert: true, new: true }
  );

  await redisClient.del("submissions" + formId);
  memoryCache.set(userId + formId + "submitted", formSubmitted);
  return res.json({ message: "Form Submitted" });
};
