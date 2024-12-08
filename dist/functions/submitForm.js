"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitForm = void 0;
const ErrorHandler_1 = require("../handlers/ErrorHandler");
const formSubmissionValidation_1 = __importDefault(require("../validation/formSubmissionValidation"));
const utils_1 = require("../lib/utils");
const formSubmitMode_1 = __importDefault(require("../models/formSubmitMode"));
const redis_1 = __importDefault(require("../lib/redis"));
const submitForm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const formId = req.params.id;
    const answer = req.body;
    if (!answer)
        throw new ErrorHandler_1.ApiError("Invalid answer", 400);
    if (!userId)
        throw new ErrorHandler_1.ApiError("Login required", 401);
    const savedForm = yield (0, utils_1.getFromDataById)(formId);
    const validate = (0, formSubmissionValidation_1.default)(savedForm.questions, answer);
    if (validate.errors)
        throw new ErrorHandler_1.ApiError("Invalid submission", 400, validate.errors);
    const formSubmitted = yield formSubmitMode_1.default.findOneAndUpdate({ userId, formId }, {
        userId,
        formId,
        submittedQuestions: answer,
    }, { upsert: true, new: true });
    yield redis_1.default.del("submissions" + formId);
    yield redis_1.default.set(userId + formId + "submitted", formSubmitted);
    return res.json({ message: "Form Submitted" });
});
exports.submitForm = submitForm;
