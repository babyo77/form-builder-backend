import { Response } from "express";
import { CustomRequest } from "../middleware/middleware";
import { ApiError } from "../handlers/ErrorHandler";
import { Form } from "../models/formModel";
import redisClient from "../lib/redis";
import { deleteSubmittedKeys, validateFrom } from "../lib/utils";

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
      sameSite: "lax",
      secure: true,
      path: "/",
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
    await deleteSubmittedKeys();
    await redisClient.set(userId + "form", savedForm);
    await redisClient.set(String(savedForm._id), savedForm);
    return res.status(204).send();
  }
  return res.status(400).json(form);
};
