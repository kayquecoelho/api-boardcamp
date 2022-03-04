import joi from "joi";

export function buildFilterOfRentals(queries) {
  const { customerId, gameId, offset, limit, order, desc, status, startDate } = queries;

  const validOrderQuery = [
    "id",
    "customerId",
    "gameId",
    "rentDate",
    "daysRented",
    "returnDate",
    "originalPrice",
    "delayFee",
  ];
  let filterQuery = "";
  let queryParams = [];

  if (parseInt(customerId)) {
    filterQuery += `WHERE r."customerId"=$${queryParams.length + 1}`;
    queryParams = [...queryParams, customerId];
  }
  if (parseInt(gameId)) {
    const queryGameId = `r."gameId"=$${queryParams.length + 1}`;
    filterQuery += filterQuery ? ` AND ${queryGameId}` : `WHERE ${queryGameId}`;
    queryParams = [...queryParams, gameId];
  }

  const validStatusQuery = ["open", "closed"];
  const isStatusValid = validStatusQuery.includes(status);
  if (isStatusValid) {
    const queryStatus = status === "open" ? `r."rentDate" IS NULL` : `r."rentDate" IS NOT NULL`;
    filterQuery += filterQuery ? ` AND ${queryStatus}` : `WHERE ${queryStatus}`;
  }

  const dateSchema = joi.date().iso().required();
  const validateDateSchema = dateSchema.validate(startDate);

  if (!validateDateSchema.error) {
    const startDateQuery = `r."rentDate" >= '${startDate}'`;
    filterQuery += filterQuery
      ? ` AND ${startDateQuery}`
      : `WHERE ${startDateQuery}`;
  }

  const isOrderValid = validOrderQuery.includes(order);
  if (isOrderValid) {
    filterQuery += `ORDER BY "${order}"`;

    if (desc === "true") {
      filterQuery += " DESC";
    }
  }

  if (offset) {
    filterQuery += `OFFSET $${queryParams.length + 1}`;
    queryParams = [...queryParams, offset];
  }

  if (limit) {
    filterQuery += `LIMIT $${queryParams.length + 1}`;
    queryParams = [...queryParams, limit];
  }

  return { filterQuery, queryParams };
}
