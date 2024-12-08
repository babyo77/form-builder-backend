import { Response } from "express";
import { CustomRequest } from "../middleware/middleware";
import { ApiError } from "../handlers/ErrorHandler";
import { Form } from "../models/formModel";

export const publishForm = async (
  req: CustomRequest,
  res: Response
): Promise<Response> => {
  const formId = req.cookies.guest_form;
  const unpublish = req.query.type;
  const userId = req.userId;
  if (!formId) throw new ApiError("Form id must be provided", 400);
  if (!userId) throw new ApiError("Login required", 401);
  // const formData = await getFromDataById(formId);
  // const isValidFormStructure = validateFormStructure(formData.questions);
  // if (isValidFormStructure.errors)
  //   throw new ApiError(
  //     "Some fields are empty",
  //     400,
  //     isValidFormStructure.errors
  //   );
  if (unpublish) {
    await Form.findByIdAndUpdate(formId, { published: false });
    return res.json({
      message: "Form Unpublished",
      _id: formId,
      publish: false,
    });
  }
  await Form.findByIdAndUpdate(formId, { published: true });
  return res.json({ message: "Form published", _id: formId, publish: true });
};
