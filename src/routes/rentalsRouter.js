import { Router } from "express";
import { addRental, deleteRental, getRentals, returnRental } from "../controllers/rentalsController.js";
import { validateRentalSchema } from "../middlewares/validateRentalSchema.js";
import { validateRentalStatus } from "../middlewares/validateRentalStatus.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", getRentals);
rentalsRouter.post("/rentals", validateRentalSchema, addRental);
rentalsRouter.post("/rentals/:id/return", validateRentalStatus, returnRental);
rentalsRouter.delete("/rentals/:id", validateRentalStatus, deleteRental);

export default rentalsRouter;
