import express from "express";
import { homeResponse } from "../lib/utils";
import asyncHandler from "../handlers/AsyncHandler";
import { middleware } from "../middleware/middleware";
import { makeSession } from "../functions/makeSession";
import { getFromData } from "../functions/getFromData";
import { checkToken } from "../functions/checkToken";
import { saveForm } from "../functions/saveForm";
import { publishForm } from "../functions/publishForm";
import { previewForm } from "../functions/previewForm";
import { submitForm } from "../functions/submitForm";
import { publicAccess } from "../middleware/publicAccess";

const router = express.Router();

router.get("/", async (_req, res) => {
  res.json(homeResponse);
});

router.get("/api/make/session", asyncHandler(makeSession));
router.get(
  "/api/form/info/:id",
  asyncHandler(publicAccess),
  asyncHandler(getFromData)
);

// auth
router.use(asyncHandler(middleware));
router.get("/api/check", asyncHandler(checkToken));
router.get("/api/form/preview", asyncHandler(previewForm));
router.get("/api/form/publish", asyncHandler(publishForm));
router.post("/api/form/submit/:id", asyncHandler(submitForm));
router.patch("/api/form/save", asyncHandler(saveForm));

export default router;
