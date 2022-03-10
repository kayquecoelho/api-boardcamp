import filters from "./filters.js";

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
  let params = [];

  if (parseInt(customerId)) {
    params = [...params, customerId];
    filterQuery += filters.customerIdFilter(params);
  }
  if (parseInt(gameId)) {
    params = [...params, gameId];
    filterQuery += filters.gameIdFilter(params, filterQuery);
  }

  const validStatusQuery = ["open", "closed"];
  filterQuery += filters.statusFilter(validStatusQuery, status);

  filterQuery += filters.dateFilter(startDate, filterQuery);

  filterQuery += filters.orderFilter(validOrderQuery, order, desc);

  if (offset) {
    params = [...params, offset];
    filterQuery += filters.offsetFilter(params);
  }
  
  if (limit) { 
    params = [...params, limit];
    filterQuery += filters.limitFilter(params);
  }

  return { filterQuery, params };
}
