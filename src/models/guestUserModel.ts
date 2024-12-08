import mongoose, { Model, Schema } from "mongoose";

export interface IGuestSession extends Document {
  guestId: string;
  isGuest: boolean;
}

const GuestSessionSchema = new Schema<IGuestSession>(
  {
    guestId: { type: String, required: true, unique: true },
    isGuest: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const GuestSession: Model<IGuestSession> = mongoose.model<IGuestSession>(
  "Guest",
  GuestSessionSchema
);
