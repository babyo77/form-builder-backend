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
exports.saveForm = void 0;
const ErrorHandler_1 = require("../handlers/ErrorHandler");
const formModel_1 = require("../models/formModel");
const redis_1 = __importDefault(require("../lib/redis"));
const utils_1 = require("../lib/utils");
const saveForm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    if (!userId)
        throw new ErrorHandler_1.ApiError("Refresh required", 401);
    const data = req.body;
    const form = (0, utils_1.validateFrom)(data.questions);
    if (form.isValid) {
        const savedForm = yield formModel_1.Form.findOneAndUpdate({ owner: userId }, data, {
            new: true,
            upsert: true,
        }).select("-updatedAt -createdAt");
        res.cookie("guest_form", String(savedForm._id), {
            httpOnly: true,
            sameSite: "lax",
            secure: true,
            path: "/",
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });
        yield (0, utils_1.deleteSubmittedKeys)();
        yield redis_1.default.set(userId + "form", savedForm);
        yield redis_1.default.set(String(savedForm._id), savedForm);
        return res.status(204).send();
    }
    return res.status(400).json(form);
});
exports.saveForm = saveForm;
