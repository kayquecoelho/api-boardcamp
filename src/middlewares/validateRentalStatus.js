import connection from "../database/database.js";

export async function validateRentalStatus(req, res, next) {
  const { id } = req.params;

  try {
    const result = await connection.query(`
      SELECT r.*, g."pricePerDay" FROM rentals r
        JOIN games g ON r."gameId"= g.id
      WHERE r.id=$1
    `, [id]);

    if (result.rowCount === 0) {
      return res.sendStatus(404);
    }

    if (result.rows[0].returnDate) {
      return res.sendStatus(400);
    }

    res.locals.rental = result.rows[0];
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }

  next();
}