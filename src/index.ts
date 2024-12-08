import express from "express";
import router from "./router/router";
import { runServer } from "./lib/runServer";
import { errorHandler } from "./handlers/ErrorHandler";
import cookieParser from "cookie-parser";
import cors from "cors";
import { limiter } from "./lib/utils";
const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(limiter);
app.use(express.json());
app.use(cookieParser());
app.use(router);
app.use(errorHandler);
runServer(app);
