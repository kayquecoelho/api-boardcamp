import connection from "../database/database.js";
import dayjs from "dayjs";

export async function getRentals (req, res) {
  const { customerId, gameId } = req.query;
  let filterQuery = "";
  const queryParams = [];

  if (customerId && gameId) {
    filterQuery = `WHERE r."gameId"=$1 AND r."customerId"=$2`;
    queryParams.splice(0,0, gameId, customerId);
  } else if (customerId && !gameId) {
    filterQuery = `WHERE r."customerId"=$1`;
    queryParams.splice(0,0,customerId);
  } else if (!customerId && gameId) {
    filterQuery = `WHERE r."gameId"=$1`;
    queryParams.splice(0,0,gameId);
  }

  try {
    const { rows: result} = await connection.query(`
      SELECT 
        r.*, g."categoryId", 
        g.name "gameName", 
        cas.name "categoryName", 
        cus.name "customerName"
      FROM rentals r
        JOIN games g ON r."gameId"=g.id
        JOIN categories cas ON cas.id=g."categoryId"
        JOIN customers cus ON cus.id=r."customerId"
      ${filterQuery}
    `, queryParams);
    
    const rentals = result.map(r => {
      const formatRental = {
        ...r,
        customer: { 
          id: r.customerId,
          name: r.customerName
        },
        game: {
          id: r.gameId,
          name: r.gameName,
          categoryId: r.categoryId,
          categoryName: r.categoryName
        }
      }
      const deleteObjKeys = ["categoryName", "categoryId", "customerName", "gameName"];

      for (const key of deleteObjKeys) {
        delete formatRental[key];
      }

      return formatRental;
    });

    res.send(rentals);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function addRental(req, res) {
  const { gameId, customerId, daysRented } = req.body;
  const { priceOfGame } = res.locals;
  const [returnDate, delayFee] = [null, null];
  const [rentDate, originalPrice] = [dayjs().format("YYYY-MM-DD"), priceOfGame * daysRented];

  try {
    await connection.query(`
      INSERT INTO rentals 
        ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
        VALUES ($1, $2, $3, $4, $5, $6, $7) 
    `, [customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee]);

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function returnRental(req, res) {
  const { id } = req.params;

  try {
    res.sendStatus(501);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function deleteRental(req, res) {
  const { id } = req.params;

  try {
    await connection.query(`DELETE FROM rentals WHERE id=$1`, [id]);

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}