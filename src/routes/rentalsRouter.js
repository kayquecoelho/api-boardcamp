import { Router } from "express";
import { addRental, getRentals } from "../controllers/rentalsController.js";
import { validateRentalSchema } from "../middlewares/validateRentalSchema.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", getRentals);
rentalsRouter.post("/rentals", validateRentalSchema, addRental);

export default rentalsRouter;
