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
exports.makeSession = void 0;
const utils_1 = require("../lib/utils");
const makeSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const guest_token = req.cookies.guest_token;
    if (guest_token) {
        return res.json({ token: guest_token });
    }
    const token = yield (0, utils_1.makeGuestSession)(res);
    return res.json({ token });
});
exports.makeSession = makeSession;
