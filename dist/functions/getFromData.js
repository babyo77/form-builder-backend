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
exports.getFromData = void 0;
const ErrorHandler_1 = require("../handlers/ErrorHandler");
const utils_1 = require("../lib/utils");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getFromData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const formId = req.params.id;
    let userId = req.userId;
    if (!formId)
        throw new ErrorHandler_1.ApiError("Form id must be provided", 400);
    if (!userId) {
        const token = yield (0, utils_1.makeGuestSession)(res);
        const payload = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY || "");
        userId = payload.userId;
    }
    const savedForm = yield (0, utils_1.getFromDataById)(formId);
    const prevSubmitted = userId
        ? yield (0, utils_1.getPreviousSubmitted)(userId, formId)
        : null;
    if (savedForm.publish) {
        return res.json({ savedForm, prevSubmitted });
    }
    if (!savedForm.publish && String(userId) == String(savedForm.owner)) {
        return res.json({ savedForm, prevSubmitted });
    }
    throw new ErrorHandler_1.ApiError("Form not published yet!", 403);
});
exports.getFromData = getFromData;
