import joi from "joi";

const gameSchema = joi.object({
  name: joi.string().required(),
  image: joi.string().uri().required(), 
  stockTotal: joi.number().integer().positive().required(), 
  categoryId: joi.number().integer().positive().required(), 
  pricePerDay: joi.number().integer().positive().required()
});

export default gameSchema;