import connection from "../database/database.js";
import dayjs from "dayjs";
import { buildFilterOfRentals } from "../helpers/buildFilterOfRentals.js";

export async function getRentals (req, res) {
  const { filterQuery, queryParams } = buildFilterOfRentals(req.query);
  
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
        rentDate: dayjs(r.rentDate).format("YYYY-MM-DD"),
        returnDate: dayjs(r.retunrDate).format("YYYY-MM-DD") ,
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
        (
          "customerId", 
          "gameId", 
          "rentDate", 
          "daysRented", 
          "returnDate", 
          "originalPrice", 
          "delayFee"
        )
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
    `, [customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee]);

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function returnRental(req, res) {
  const { rentDate, daysRented, pricePerDay, id } = res.locals.rental;
  let delayFee = 0;
  
  const returnDate = dayjs();
  const deadline = dayjs(rentDate).add(daysRented, "day");
  const isOverdue = dayjs(returnDate).isAfter(deadline);

  if (isOverdue) {
    const daysExceeded = (returnDate - deadline) / (1000 * 3600 * 24);
    delayFee = pricePerDay * Math.ceil(daysExceeded);
  }

  try {
    await connection.query(`
      UPDATE rentals 
        SET "returnDate"=$1, "delayFee"=$2
      WHERE id=$3
    `, [returnDate.format("YYYY-MM-DD"), delayFee, id]);

    res.sendStatus(200);
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