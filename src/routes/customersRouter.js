import { Router } from "express";
import { addCustomer, getCustomers } from "../controllers/customersController.js";
import { validateCustomerSchema } from "../middlewares/validateCustomerSchema.js";


const customersRouter = Router();

customersRouter.get("/customers", getCustomers);
customersRouter.post("/customers", validateCustomerSchema, addCustomer);

export default customersRouter;