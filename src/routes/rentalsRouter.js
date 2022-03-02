import { Router } from "express";
import { addRental } from "../controllers/rentalsController.js";
import { validateRentalSchema } from "../middlewares/validateRentalSchema.js";

const rentalsRouter = Router();

//rentalsRouter.get("/rentals", getGames);
rentalsRouter.post("/rentals", validateRentalSchema, addRental);

export default rentalsRouter;
