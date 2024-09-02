import { Router } from "express";
import { measuresRoutes } from "@routes/measures-routes";

export const routes = Router();

routes.use("/measures", measuresRoutes);
