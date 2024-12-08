import { Response } from "express";
import { CustomRequest } from "../middleware/middleware";
import { ApiError } from "../handlers/ErrorHandler";
import { Form } from "../models/formModel";
import { deleteCacheByPattern, validateFrom } from "../lib/utils";
import { memoryCache } from "../cache/cache";

export const saveForm = async (
  req: CustomRequest,
  res: Response
): Promise<Response> => {
  const userId = req.userId;
  if (!userId) throw new ApiError("Refresh required", 401);
  const data = req.body;
  const form = validateFrom(data.questions);
  if (form.isValid) {
    const savedForm = await Form.findOneAndUpdate({ owner: userId }, data, {
      new: true,
      upsert: true,
    }).select("-updatedAt -createdAt");

    res.cookie("guest_form", String(savedForm._id), {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      path: "/",
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
    deleteCacheByPattern("submitted");
    memoryCache.set(userId + "form", savedForm);
    memoryCache.set(String(savedForm._id), savedForm);
    return res.send(String(savedForm._id));
  }
  return res.status(400).json(form);
};
