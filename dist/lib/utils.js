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
exports.getPreviousSubmitted = exports.getSubmission = exports.makeGuestSession = exports.limiter = exports.validateFrom = exports.homeResponse = void 0;
exports.getFormPreview = getFormPreview;
exports.getFromDataById = getFromDataById;
exports.deleteSubmittedKeys = deleteSubmittedKeys;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const formModel_1 = require("../models/formModel");
const redis_1 = __importDefault(require("./redis"));
const mongoose_1 = __importDefault(require("mongoose"));
const guestUserModel_1 = require("../models/guestUserModel");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const formSubmitMode_1 = __importDefault(require("../models/formSubmitMode"));
exports.homeResponse = {
    info: "@babyo7_",
    code: "777",
    bio: "cursed",
};
const validateFrom = (formStructure) => {
    const errors = [];
    if (!Array.isArray(formStructure)) {
        return {
            isValid: false,
            errors: [
                {
                    position: 0,
                    category: "general",
                    type: "INVALID_STRUCTURE",
                    message: "Form structure must be a non-empty array",
                },
            ],
        };
    }
    return {
        isValid: errors.length === 0,
        errors: errors.length > 0 ? errors : null,
    };
};
exports.validateFrom = validateFrom;
function getFormPreview(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const saved = yield redis_1.default.get(userId + "form");
        const savedForm = saved
            ? saved
            : yield formModel_1.Form.findOne({ owner: new mongoose_1.default.Types.ObjectId(userId) }).select("-updatedAt -createdAt");
        return savedForm;
    });
}
function getFromDataById(formId) {
    return __awaiter(this, void 0, void 0, function* () {
        const saved = yield redis_1.default.get(formId);
        const savedForm = saved
            ? saved
            : yield formModel_1.Form.findById(new mongoose_1.default.Types.ObjectId(formId)).select("-updatedAt -createdAt");
        return savedForm;
    });
}
exports.limiter = (0, express_rate_limit_1.default)({
    windowMs: 2 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    validate: {
        xForwardedForHeader: false,
    },
});
const makeGuestSession = (res) => __awaiter(void 0, void 0, void 0, function* () {
    const guestId = `guest-${Date.now()}`;
    const guestSession = yield guestUserModel_1.GuestSession.create({ guestId });
    const token = jsonwebtoken_1.default.sign({ userId: guestSession._id.toString(), isGuest: true }, process.env.SECRET_KEY || "", { expiresIn: "30d" });
    res.cookie("guest_token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        path: "/",
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
    return token;
});
exports.makeGuestSession = makeGuestSession;
const getSubmission = (savedForm) => __awaiter(void 0, void 0, void 0, function* () {
    const redisSubmission = yield yield redis_1.default.get("submissions" + String(savedForm._id));
    const submissions = redisSubmission
        ? redisSubmission
        : yield formSubmitMode_1.default.aggregate([
            {
                $match: {
                    formId: new mongoose_1.default.Types.ObjectId(String(savedForm._id)),
                },
            },
            {
                $lookup: {
                    from: "guests", // The collection name of the referenced `Guest` model
                    localField: "userId", // The field in `FormSubmitted` that references `Guest`
                    foreignField: "_id", // The `_id` field in `Guest` that `userId` references
                    as: "guestInfo", // Output array containing matched `Guest` documents
                },
            },
            {
                $unwind: "$guestInfo", // Convert the guestInfo array to a single object
            },
            {
                $project: {
                    _id: 0,
                    submittedAt: {
                        $dateToString: { format: "%d/%m/%Y", date: "$createdAt" },
                    },
                    userId: "$guestInfo.guestId",
                },
            },
        ]);
    yield redis_1.default.set("submissions" + String(savedForm._id), submissions);
    return submissions;
});
exports.getSubmission = getSubmission;
const getPreviousSubmitted = (userId, formId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const redisAnswer = yield redis_1.default.get(userId + formId + "submitted");
    const answers = redisAnswer
        ? redisAnswer
        : yield formSubmitMode_1.default.findOne({ userId, formId }).select("-updatedAt -createdAt");
    if (answers) {
        const formData = (_a = answers
            .toObject()
            .submittedQuestions) === null || _a === void 0 ? void 0 : _a.reduce((acc, { _id, value }) => {
            acc[String(_id)] = value;
            return acc;
        }, {});
        return formData;
    }
    return null;
});
exports.getPreviousSubmitted = getPreviousSubmitted;
function deleteSubmittedKeys() {
    return __awaiter(this, void 0, void 0, function* () {
        let cursor = "0";
        const pattern = "*submitted"; // Match all keys ending with "submitted"
        do {
            // Perform the scan operation with the MATCH option
            const [newCursor, keys] = yield redis_1.default.scan(cursor, {
                match: pattern,
            });
            cursor = newCursor; // Update cursor for next cycle
            if (keys.length > 0) {
                // Delete the matching keys
                yield redis_1.default.del(...keys);
                console.log(`Deleted keys: ${keys}`);
            }
        } while (cursor !== "0"); // Continue scanning until cursor is "0"
    });
}
