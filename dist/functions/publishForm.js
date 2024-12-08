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
exports.publishForm = void 0;
const ErrorHandler_1 = require("../handlers/ErrorHandler");
const formModel_1 = require("../models/formModel");
const publishForm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const formId = req.cookies.guest_form;
    const unpublish = req.query.type;
    const userId = req.userId;
    if (!formId)
        throw new ErrorHandler_1.ApiError("Form id must be provided", 400);
    if (!userId)
        throw new ErrorHandler_1.ApiError("Login required", 401);
    // const formData = await getFromDataById(formId);
    // const isValidFormStructure = validateFormStructure(formData.questions);
    // if (isValidFormStructure.errors)
    //   throw new ApiError(
    //     "Some fields are empty",
    //     400,
    //     isValidFormStructure.errors
    //   );
    if (unpublish) {
        yield formModel_1.Form.findByIdAndUpdate(formId, { published: false });
        return res.json({
            message: "Form Unpublished",
            _id: formId,
            publish: false,
        });
    }
    yield formModel_1.Form.findByIdAndUpdate(formId, { published: true });
    return res.json({ message: "Form published", _id: formId, publish: true });
});
exports.publishForm = publishForm;
