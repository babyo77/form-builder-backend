import mongoose, { Document, Schema } from "mongoose";

interface SubmittedQuestion {
  _id: mongoose.Types.ObjectId;
  value: string;
}

interface SubmittedForm extends Document {
  userId: mongoose.Types.ObjectId;
  formId: mongoose.Types.ObjectId;
  submittedQuestions: SubmittedQuestion[];
}

const SubmittedQuestionSchema = new Schema<SubmittedQuestion>({
  _id: { type: Schema.Types.ObjectId, required: true },
  value: { type: String },
});

const SubmittedFormSchema = new Schema<SubmittedForm>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Guest",
      required: true,
    },
    formId: {
      type: Schema.Types.ObjectId,
      ref: "Form",
      required: true,
    },
    submittedQuestions: [SubmittedQuestionSchema],
  },
  {
    timestamps: true,
  }
);

const FormSubmitted = mongoose.model<SubmittedForm>(
  "SubmittedForm",
  SubmittedFormSchema
);

export default FormSubmitted;
