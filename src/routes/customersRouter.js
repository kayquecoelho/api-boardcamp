import { Router } from "express";
import { addCustomer, getCustomerById, getCustomers, updateCustomerData } from "../controllers/customersController.js";
import { validateCustomerSchemaData } from "../middlewares/validateCustomerSchemaData.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import customerSchema from "../schemas/customerSchema.js";

const customersRouter = Router();

customersRouter.get("/customers", getCustomers);
customersRouter.get("/customers/:id", getCustomerById);
customersRouter.post("/customers", validateSchema(customerSchema), validateCustomerSchemaData, addCustomer);
customersRouter.put("/customers/:id", validateSchema(customerSchema), validateCustomerSchemaData, updateCustomerData);

export default customersRouter;