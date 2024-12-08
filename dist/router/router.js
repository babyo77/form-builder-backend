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
const express_1 = __importDefault(require("express"));
const utils_1 = require("../lib/utils");
const AsyncHandler_1 = __importDefault(require("../handlers/AsyncHandler"));
const middleware_1 = require("../middleware/middleware");
const makeSession_1 = require("../functions/makeSession");
const getFromData_1 = require("../functions/getFromData");
const checkToken_1 = require("../functions/checkToken");
const saveForm_1 = require("../functions/saveForm");
const publishForm_1 = require("../functions/publishForm");
const previewForm_1 = require("../functions/previewForm");
const submitForm_1 = require("../functions/submitForm");
const publicAccess_1 = require("../middleware/publicAccess");
const router = express_1.default.Router();
router.get("/", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json(utils_1.homeResponse);
}));
router.get("/api/make/session", (0, AsyncHandler_1.default)(makeSession_1.makeSession));
router.get("/api/form/info/:id", (0, AsyncHandler_1.default)(getFromData_1.getFromData));
router.post("/api/form/submit/:id", publicAccess_1.publicAccess, (0, AsyncHandler_1.default)(submitForm_1.submitForm));
// auth
router.use((0, AsyncHandler_1.default)(middleware_1.middleware));
router.get("/api/check", (0, AsyncHandler_1.default)(checkToken_1.checkToken));
router.get("/api/form/preview", (0, AsyncHandler_1.default)(previewForm_1.previewForm));
router.get("/api/form/publish", (0, AsyncHandler_1.default)(publishForm_1.publishForm));
router.patch("/api/form/save", (0, AsyncHandler_1.default)(saveForm_1.saveForm));
exports.default = router;
