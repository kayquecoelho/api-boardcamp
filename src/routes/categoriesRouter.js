import { Router } from "express";
import { createCategories, getCategories } from "../controllers/categoriesController.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import categorieSchema from "../schemas/categorieSchema.js";

const categoriesRouter = Router();

categoriesRouter.get("/categories", getCategories);
categoriesRouter.post("/categories", validateSchema(categorieSchema), createCategories);

export default categoriesRouter;
