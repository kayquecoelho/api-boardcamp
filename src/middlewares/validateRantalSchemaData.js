import connection from "../database/database.js";

export async function validateRentalSchemaData(req, res, next) {
  try {
    const gameIdExists = await connection.query(`
      SELECT id, "stockTotal", "pricePerDay" FROM games 
        WHERE id=$1
    `, [req.body.gameId]);

    if (gameIdExists.rowCount === 0) {
      return res.sendStatus(400);
    }

    const customerIdExists = await connection.query(`
      SELECT id FROM customers
        WHERE id=$1
    `, [req.body.customerId]);
    
    if (customerIdExists.rowCount === 0) {
      return res.sendStatus(400);
    }

    const amountOfRentedGames = await connection.query(`
      SELECT id FROM rentals WHERE "gameId"=$1 AND "returnDate"=null
    `, [req.body.gameId]);

    if (amountOfRentedGames.rowCount === gameIdExists.rows[0].stockTotal) {
      return res.sendStatus(400);
    }
    
  } catch (error) {
    res.status(500).send(error);
  }

  res.locals.priceOfGame = gameIdExists.rows[0].pricePerDay;

  next();
}