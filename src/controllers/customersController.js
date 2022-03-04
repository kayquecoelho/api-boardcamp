import connection from "../database/database.js";
import dayjs from "dayjs";

export async function getCustomers(req, res) {
  const validOrderQuery = ["id", "name", "phone", "birthday", "cpf"];
  const { offset, limit, cpf, order, desc } = req.query;
  let filterQuery = "";
  let queryParams = [];

  const isOrderValid = validOrderQuery.includes(order);
  if (isOrderValid) {
    filterQuery += `ORDER BY "${order}"`;

    if (desc === "true") {
      filterQuery += " DESC"
    }
  }

  if (cpf) {
    filterQuery += `WHERE cpf LIKE $${queryParams.length + 1}`
    queryParams = [...queryParams, `${cpf}%`];
  }
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
      SELECT * FROM customers
       ${filterQuery}   
    `, queryParams);

    const costumers = result.rows.map(c => ({
      ...c,
      birthday: dayjs(c.birthday).format("YYYY-MM-DD")
    }));

    res.send(costumers);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function addCustomer(req, res) {
  const { name, cpf, phone, birthday } = req.body;

  try {
    await connection.query(`
      INSERT INTO customers (name, phone, cpf, birthday)
        VALUES ($1, $2, $3, $4) 
    `, [name, phone, cpf, birthday]);

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function getCustomerById(req, res) {
  const { id } = req.params;

  try {
    const customer = await connection.query(`SELECT * FROM customers WHERE id=$1`, [id]);

    if (customer.rowCount === 0) {
      return res.sendStatus(404);
    }

    res.send(customer[0]);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function updateCustomerData(req, res) {
  const { name, cpf, phone, birthday } = req.body;
  const { id } = req.params;

  try {
    await connection.query(`
      UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4
        WHERE id=$5
    `, [name, phone, cpf, birthday, id]);

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}