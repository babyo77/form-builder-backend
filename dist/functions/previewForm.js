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
Object.defineProperty(exports, "__esModule", { value: true });
exports.previewForm = void 0;
const ErrorHandler_1 = require("../handlers/ErrorHandler");
const utils_1 = require("../lib/utils");
const previewForm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const formId = req.headers.form || req.cookies.guest_form;
    if (!userId)
        throw new ErrorHandler_1.ApiError("Login required", 401);
    const savedForm = yield (0, utils_1.getFormPreview)(userId);
    const prevSubmitted = yield (0, utils_1.getPreviousSubmitted)(userId, formId);
    return res.json({ savedForm, prevSubmitted });
});
exports.previewForm = previewForm;
