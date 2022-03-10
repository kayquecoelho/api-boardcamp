import joi from "joi";

function offsetFilter(params) {
  const filterQuery = ` OFFSET $${params.length}`
  return filterQuery;
}

function limitFilter(params) {
  const filterQuery = ` LIMIT $${params.length}`
  return filterQuery;
}

function orderFilter(validOrder, order, desc) {
  const isOrderValid = validOrder.includes(order);
  let filterQuery = "";
  if (isOrderValid) {
    filterQuery += ` ORDER BY "${order}"`;

    if (desc === "true") {
      filterQuery += " DESC"
    }
  }

  return filterQuery;
}

function statusFilter(validStatus, status) {
  let filterQuery = "";
  const isStatusValid = validStatus.includes(status);

  if (isStatusValid) {
    const queryStatus = status === "open" ? `r."rentDate" IS NULL` : `r."rentDate" IS NOT NULL`;
    filterQuery += filterQuery ? ` AND ${queryStatus}` : `WHERE ${queryStatus}`;
  }

  return filterQuery;
}

function customerIdFilter(params) {
  let filterQuery = filterQuery += `WHERE r."customerId"=$${params.length}`;

  return filterQuery;
}
function gameIdFilter(params, query) {
  let filterQuery = query;

  const queryGameId = `r."gameId"=$${params.length}`;
  filterQuery += filterQuery ? ` AND ${queryGameId}` : `WHERE ${queryGameId}`;

  return filterQuery;
}

function dateFilter(date, query) {
  let filterQuery = query;

  const dateSchema = joi.date().iso().required();
  const validateDateSchema = dateSchema.validate(date);

  if (!validateDateSchema.error) {
    const startDateQuery = `r."rentDate" >= '${startDate}'`;
    filterQuery += filterQuery
      ? ` AND ${startDateQuery}`
      : `WHERE ${startDateQuery}`;
  }

  return filterQuery;
}

const filters = {
  statusFilter,
  orderFilter, 
  offsetFilter,
  limitFilter,
  customerIdFilter,
  gameIdFilter,
  dateFilter
}

export default filters;