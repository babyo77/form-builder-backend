"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router_1 = __importDefault(require("./router/router"));
const runServer_1 = require("./lib/runServer");
const ErrorHandler_1 = require("./handlers/ErrorHandler");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const utils_1 = require("./lib/utils");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
}));
app.use(utils_1.limiter);
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(router_1.default);
app.use(ErrorHandler_1.errorHandler);
(0, runServer_1.runServer)(app);
