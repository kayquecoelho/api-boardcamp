import { Router } from "express";
import { createGame, getGames } from "../controllers/gamesController.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import gameSchema from "../schemas/gameSchema.js";

const gamesRouter = Router();

gamesRouter.get("/games", getGames);
gamesRouter.post("/games", validateSchema(gameSchema), createGame);

export default gamesRouter;
