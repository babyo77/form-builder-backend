import { FormQuestion } from "./formSubmissionValidation";

interface ValidationError {
  id?: string;
  category: string;
  type: string;
  message: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[] | null;
}

function validateFormStructure(
  formStructure: FormQuestion[]
): ValidationResult {
  const errors: ValidationError[] = [];

  // Check if formStructure is an array and not empty
  if (!Array.isArray(formStructure) || formStructure.length === 0) {
    return {
      isValid: false,
      errors: [
        {
          id: "",
          category: "general",
          type: "INVALID_STRUCTURE",
          message: "Form structure must be a non-empty array",
        },
      ],
    };
  }

  formStructure.forEach((question) => {
    // Check for empty titles in specific categories
    const categoriesRequiringTitle: string[] = [
      "long_answer",
      "single_select",
      "date",
      "url",
    ];
    if (categoriesRequiringTitle.includes(question.category)) {
      if (!question.title || question.title.trim() === "") {
        errors.push({
          id: question._id,
          category: question.category,
          type: "MISSING_TITLE",
          message: `Title is required for ${question.category} at id ${question.id}`,
        });
      }
    }

    // Special validation for single_select
    if (question.category === "single_select") {
      // Check if options exist and have exactly two options
      if (
        !question.options ||
        !Array.isArray(question.options) ||
        question.options.length !== 2
      ) {
        errors.push({
          id: question._id,
          category: "single_select",
          type: "INVALID_OPTIONS",
          message: `Single select at id ${question.id} must have exactly two options`,
        });
      }
    }
  });

  // Return validation result
  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : null,
  };
}

export { validateFormStructure, ValidationResult, ValidationError };
