import connection from "../database/database.js";
import filters from "../helpers/filters.js";

export async function getGames(req, res) {
  const validOrderQuery = ["id", "name", "stockTotal","categoryId","pricePerDay", "image"];  
  const { offset, limit, name, order, desc } = req.query;
  let filterQuery = "";
  let params = [];
  
  filterQuery += filters.orderFilter(validOrderQuery, order, desc);
  
  if (name) {
    params = [...params, `${name}%`];
    filterQuery += `WHERE g.name ILIKE $${params.length}`
  }

  if (offset) {
    params = [...params, offset];
    filterQuery += filters.offsetFilter(params);
  }
  
  if (limit) { 
    params = [...params, limit];
    filterQuery += filters.limitFilter(params);
  }

  try {
    const result = await connection.query(`
      SELECT g.*, c.name AS "categoryName" FROM games g
        JOIN categories c ON g."categoryId" = c.id
      ${filterQuery}
    `, params);

    res.send(result.rows);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function createGame(req, res) {
  const { name, image, stockTotal, categoryId, pricePerDay } = req.body;
  
  try {
    const isIdValid = await connection.query(`
      SELECT id FROM categories WHERE id=$1
    `, [categoryId]);

    if (isIdValid.rows.length === 0) {
      return res.sendStatus(400);
    }
    
    const nameExists = await connection.query(`
      SELECT name FROM games WHERE name=$1
    `, [name]);

    if (nameExists.rows.length !== 0){
      return res.sendStatus(409);
    }
    
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