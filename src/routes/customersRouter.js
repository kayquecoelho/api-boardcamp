import { Router } from "express";
import { addCustomer, getCustomerById, getCustomers } from "../controllers/customersController.js";
import { validateCustomerSchema } from "../middlewares/validateCustomerSchema.js";


const customersRouter = Router();

customersRouter.get("/customers", getCustomers);
customersRouter.get("/customers/:id", getCustomerById);
customersRouter.post("/customers", validateCustomerSchema, addCustomer);

export default customersRouter;