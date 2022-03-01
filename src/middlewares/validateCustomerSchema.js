import connection from "../database/database.js";
import customerSchema from "../schemas/customerSchema.js";

export async function validateCustomerSchema(req, res, next) {
  const validateResult = customerSchema.validate(req.body, { abortEarly: false });

  if (validateResult.error) {
    const message = validateResult.error.details.map(d => d.message);
    return res.status(400).send(message.join(", "));
  }
  
  if (req.method === "POST") {
    const result = await connection.query(`
      SELECT cpf FROM customers 
        WHERE cpf=$1
    `, [req.body.cpf]);

    if (result.rows.length !== 0) {
      return res.sendStatus(409);
    }
  } 

  if (req.method === "PUT") {
    const { rows: customer } = await connection.query(`
      SELECT id, cpf FROM customers
        WHERE id=$1    
    `, [req.params.id]);

    if (customer.length === 0) {
      return res.sendStatus(404);
    }

    if (customer[0].cpf !== req.body.cpf) {
      const { rows: result } = await connection.query(`
        SELECT cpf FROM customers 
          WHERE cpf=$1
      `, [req.body.cpf]);
  
      if (result.length !== 0) {
        return res.sendStatus(409);
      }
    }
  }

  next();  
}