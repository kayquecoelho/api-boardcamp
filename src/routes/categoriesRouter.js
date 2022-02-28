import { Router } from "express";
import { createCategories, getCategories } from "../controllers/categoriesController.js";

const categoriesRouter = Router();

categoriesRouter.get("/categories", getCategories);
categoriesRouter.post("/categories", createCategories);

export default categoriesRouter;
