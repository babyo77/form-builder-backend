import { Response } from "express";
import { CustomRequest } from "../middleware/middleware";
import { ApiError } from "../handlers/ErrorHandler";
import { Form } from "../models/formModel";
import { getFromDataById } from "../lib/utils";
import { validateFormStructure } from "../validation/formStructureValidation";
import { memoryCache } from "../cache/cache";

export const publishForm = async (
  req: CustomRequest,
  res: Response
): Promise<Response> => {
  const formId = req.headers.form || req.cookies.guest_form;
  const unpublish = req.query.type;
  const userId = req.userId;
  if (!formId) throw new ApiError("Form id must be provided", 400);
  if (!userId) throw new ApiError("Login required", 401);
  const formData = await getFromDataById(formId);
  const isValidFormStructure = validateFormStructure(formData.questions);
  if (isValidFormStructure.errors?.length == 1)
    throw new ApiError(
      "At least one question is required to publish",
      400,
      isValidFormStructure.errors
    );
  memoryCache.del(String(formId));
  memoryCache.del(userId + "form");
  if (unpublish) {
    await Form.findByIdAndUpdate(formId, { publish: false });
    return res.json({
      message: "Form Unpublished",
      _id: formId,
      publish: false,
    });
  }

  await Form.findByIdAndUpdate(formId, { publish: true });
  return res.json({ message: "Form published", _id: formId, publish: true });
};
