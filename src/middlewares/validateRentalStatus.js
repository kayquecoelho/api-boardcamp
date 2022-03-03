import connection from "../database/database.js";

export async function validateRentalStatus(req, res, next) {
  const result = await connection.query(`
    SELECT id, "returnDate" FROM rentals
      WHERE id=$1
  `, [id]);

  if (result.rowCount === 0) {
    return res.sendStatus(404);
  }

  if (result.rows[0].returnDate) {
    return res.sendStatus(400);
  }

  next();
}