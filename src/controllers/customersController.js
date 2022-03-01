import connection from "../database/database.js"

export async function getCustomers(req, res) {
  let { cpf } = req.query;

  if (!cpf) {
    cpf = "";
  }

  try {
    const result = await connection.query(`
      SELECT * FROM customers
        WHERE cpf LIKE $1    
    `, [`${cpf}%`]);

    res.send(result.rows);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
