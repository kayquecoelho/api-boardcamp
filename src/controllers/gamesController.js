import connection from "../database/database.js"

export async function getGames(req, res) {
  let { name } = req.query;

  if (!name) {
    name = ""
  }

  try {
    const result = await connection.query(`
      SELECT g.*, c.name AS "categoryName"  FROM games g
        JOIN categories c ON g."categoryId" = c.id
      WHERE g.name ILIKE $1
      `, [`${name}%`]);

    res.send(result.rows);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function createGame(req, res) {
  const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

  const typeCondition = !name || isNaN(stockTotal) || isNaN(pricePerDay);
  const amountCondition = stockTotal <= 0 || pricePerDay <= 0;

  if (typeCondition || amountCondition) {
    return res.sendStatus(400);
  }
  
  try {
    const isIDValid = await connection.query(`
      SELECT id FROM categories WHERE id=$1
    `, [categoryId]);

    if (isIDValid.rows.length === 0) {
      return res.sendStatus(400);
    }
    
    const nameExists = await connection.query(`
      SELECT name FROM games WHERE name=$1
    `, [name]);

    if (nameExists.rows.length !== 0){
      return res.sendStatus(409);
    }
    console.log("OI")
    await connection.query(`
      INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay")
        VALUES ($1, $2, $3, $4, $5)
    `, [name, image, stockTotal, categoryId, pricePerDay]);

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}