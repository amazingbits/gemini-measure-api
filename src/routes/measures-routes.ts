import { Router } from "express";
import { confirm, list, upload } from "@controllers/measures-controller";

export const measuresRoutes = Router();

measuresRoutes.post("/upload", upload);
measuresRoutes.patch("/confirm", confirm);
measuresRoutes.get("/:customer_code/list", list);
