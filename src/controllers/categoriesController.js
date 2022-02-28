import connection from "../database/database.js"

export async function getCategories(req, res) {
  try {
    const result = await connection.query(`SELECT * FROM categories`);

    res.send(result.rows);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function createCategories(req, res) {
  const { name } = req.body;
  
  if (!name){
    return res.sendStatus(400);
  }

  try {
    const result = await connection.query(`
      SELECT * FROM categories 
        WHERE name=$1
      `, [name]);

    if (result.rows.length !== 0) {
      return res.sendStatus(409);
    }

    await connection.query(`
      INSERT INTO categories (name) VALUES ($1)
    `, [name])

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}