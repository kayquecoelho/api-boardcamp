import connection from "../database/database.js";
import rentalSchema from "../schemas/rentalSchema.js";

export async function validateRentalSchema(req, res, next) {
  const validateResult = rentalSchema.validate(req.body, { abortEarly: false });

  if (validateResult.error) {
    const message = validateResult.error.details.map(d => d.message);
    return res.status(400).send(message.join(", "));
  }
  
  const gameIdExists = await connection.query(`
    SELECT id, "stockTotal", "pricePerDay" FROM games 
      WHERE id=$1
  `, [req.body.gameId]);

  if (gameIdExists.rows.length === 0) {
    return res.sendStatus(400);
  }

  const customerIdExists = await connection.query(`
    SELECT id FROM customers
      WHERE id=$1
  `, [req.body.customerId]);
  
  if (customerIdExists.rows.length === 0) {
    return res.sendStatus(400);
  }

  const rentedGames = await connection.query(`
    SELECT id FROM rentals 
      WHERE "gameId"=$1
  `, [req.body.gameId]);

  if (rentedGames.rows.length === gameIdExists.rows[0].stockTotal) {
    return res.sendStatus(400);
  }

  res.locals.priceOfGame = gameIdExists.rows[0].pricePerDay;

  next();
}