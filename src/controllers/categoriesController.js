import connection from "../database/database.js"

export async function getCategories(req, res) {
  const { offset, limit } = req.query;
  let filterQuery = "";
  let queryParams = [];

  if (offset) {
    filterQuery += `OFFSET $${queryParams.length + 1}`;
    queryParams = [...queryParams, offset];
  }
  if (limit) { 
    filterQuery += `LIMIT $${queryParams.length + 1}`;
    queryParams = [...queryParams, limit];
  }

  try {
    const result = await connection.query(`
      SELECT * FROM categories ${filterQuery}
    `, queryParams);

    res.send(result.rows);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function createCategories(req, res) {
  const { name } = req.body;

  try {
    const result = await connection.query(`SELECT * FROM categories WHERE name=$1`, [name]);

    if (result.rowCount !== 0) {
      return res.sendStatus(409);
    }

    await connection.query(`INSERT INTO categories (name) VALUES ($1)`, [name]);

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}