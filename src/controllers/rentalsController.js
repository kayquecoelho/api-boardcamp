import connection from "../database/database.js";
import dayjs from "dayjs";

export async function getRentals (req, res) {
  let { customerId, gameId } = req.query;

  if (!customerId) {
    customerId = "";
  }
  if (gameId) {
    gameId = "";
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
    `);
   
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

      delete formatRental.categoryName
      delete formatRental.categoryId
      delete formatRental.customerName
      delete formatRental.gameName

      return formatRental;
    })
    res.send(rentals)
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