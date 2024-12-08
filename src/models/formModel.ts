import mongoose, { Schema, Document, Model } from "mongoose";
import { FormQuestion } from "../validation/formSubmissionValidation";

export interface IForm extends Document {
  form_title: string;
  owner: mongoose.Types.ObjectId;
  questions: FormQuestion[];
  publish: boolean;
}

const QuestionSchema = new Schema<FormQuestion>({
  _id: {
    type: mongoose.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  id: { type: Number, required: true },
  category: {
    type: String,
    required: true,
    enum: [
      "short_answer",
      "long_answer",
      "single_select",
      "date",
      "url",
      "number",
    ],
  },
  title: { type: String, trim: true },
  helpText: { type: String, trim: true },
  required: { type: Boolean, default: false },
  options: {
    type: [String],
    validate: {
      validator: function (this: FormQuestion, v: string[]) {
        if (this.category === "single_select") {
          return v && v.length === 1;
        }
        return v === null || v.length === 0;
      },
      message: "Single select must have exactly two options",
    },
  },
});

const FormSchema = new Schema<IForm>(
  {
    form_title: { type: String, default: "Untitled Form", trim: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guest",
      required: true,
    },
    questions: [QuestionSchema],
    publish: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Form: Model<IForm> = mongoose.model<IForm>("Form", FormSchema);
