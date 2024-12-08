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
exports.checkToken = void 0;
const ErrorHandler_1 = require("../handlers/ErrorHandler");
const utils_1 = require("../lib/utils");
const checkToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = req.userId;
    if (!userId)
        throw new ErrorHandler_1.ApiError("Refresh required", 401);
    const token = req.cookies.guest_token || ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1]);
    const savedForm = yield (0, utils_1.getFormPreview)(userId);
    const submissions = yield (0, utils_1.getSubmission)(savedForm);
    const payload = {
        token,
        savedForm,
        submissions,
    };
    return res.json(payload);
});
exports.checkToken = checkToken;
