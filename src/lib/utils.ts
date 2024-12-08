import rateLimit from "express-rate-limit";
import { Form, IForm } from "../models/formModel";
import { ValidationError } from "../validation/formStructureValidation";
import redisClient from "./redis";
import mongoose from "mongoose";
import { GuestSession } from "../models/guestUserModel";
import { Response } from "express";
import jwt from "jsonwebtoken";
import FormSubmitted from "../models/formSubmitMode";
export const homeResponse = {
  info: "@babyo7_",
  code: "777",
  bio: "cursed",
};

export const validateFrom = (formStructure: any) => {
  const errors: ValidationError[] = [];

  if (!Array.isArray(formStructure)) {
    return {
      isValid: false,
      errors: [
        {
          position: 0,
          category: "general",
          type: "INVALID_STRUCTURE",
          message: "Form structure must be a non-empty array",
        },
      ],
    };
  }
  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : null,
  };
};

export async function getFormPreview(userId: string) {
  const saved = await redisClient.get(userId + "form");
  const savedForm = saved
    ? saved
    : await Form.findOne({ owner: new mongoose.Types.ObjectId(userId) }).select(
        "-updatedAt -createdAt"
      );
  return savedForm as IForm;
}

export async function getFromDataById(formId: string) {
  const saved = await redisClient.get(formId);

  const savedForm: IForm = saved
    ? saved
    : await Form.findById(new mongoose.Types.ObjectId(formId)).select(
        "-updatedAt -createdAt"
      );
  return savedForm;
}

export const limiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  validate: {
    xForwardedForHeader: false,
  },
});

export const makeGuestSession = async (res: Response) => {
  const guestId = `guest-${Date.now()}`;
  const guestSession = await GuestSession.create({ guestId });

  const token = jwt.sign(
    { userId: guestSession._id.toString(), isGuest: true },
    process.env.SECRET_KEY || "",
    { expiresIn: "30d" }
  );

  res.cookie("guest_token", token, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    path: "/",
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
  return token;
};

export const getSubmission = async (savedForm: IForm) => {
  const redisSubmission = await await redisClient.get(
    "submissions" + String(savedForm._id)
  );
  const submissions = redisSubmission
    ? redisSubmission
    : await FormSubmitted.aggregate([
        {
          $match: {
            formId: new mongoose.Types.ObjectId(String(savedForm._id)),
          },
        },
        {
          $lookup: {
            from: "guests", // The collection name of the referenced `Guest` model
            localField: "userId", // The field in `FormSubmitted` that references `Guest`
            foreignField: "_id", // The `_id` field in `Guest` that `userId` references
            as: "guestInfo", // Output array containing matched `Guest` documents
          },
        },
        {
          $unwind: "$guestInfo", // Convert the guestInfo array to a single object
        },
        {
          $project: {
            _id: 0,
            submittedAt: {
              $dateToString: { format: "%d/%m/%Y", date: "$createdAt" },
            },
            userId: "$guestInfo.guestId",
          },
        },
      ]);
  await redisClient.set("submissions" + String(savedForm._id), submissions);
  return submissions;
};

export const getPreviousSubmitted = async (userId: string, formId: string) => {
  const redisAnswer = await redisClient.get(userId + formId + "submitted");
  const answers = redisAnswer
    ? redisAnswer
    : await FormSubmitted.findOne({ userId, formId }).select(
        "-updatedAt -createdAt"
      );
  if (answers) {
    const formData = (answers as IForm)
      .toObject()
      .submittedQuestions?.reduce((acc: any, { _id, value }: any) => {
        acc[String(_id)] = value;
        return acc;
      }, {} as Record<string, string>);
    return formData;
  }
  return null;
};

export async function deleteSubmittedKeys() {
  let cursor = "0";
  const pattern = "*submitted"; // Match all keys ending with "submitted"

  do {
    // Perform the scan operation with the MATCH option
    const [newCursor, keys] = await redisClient.scan(cursor, {
      match: pattern,
    });
    cursor = newCursor; // Update cursor for next cycle

    if (keys.length > 0) {
      // Delete the matching keys
      await redisClient.del(...keys);
      console.log(`Deleted keys: ${keys}`);
    }
  } while (cursor !== "0"); // Continue scanning until cursor is "0"
}
