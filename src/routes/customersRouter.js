import { Router } from "express";
import { getCustomers } from "../controllers/customersController.js";

const customersRouter = Router();

customersRouter.get("/customers", getCustomers);


export default customersRouter;