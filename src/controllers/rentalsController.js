import connection from "../database/database.js";
import dayjs from "dayjs";

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