import joi from "joi";

const customerSchema = joi.object({
  name: joi.string().required(),
  phone: joi.string().pattern(/^[0-9]{10,11}$/).required(),
  cpf: joi.string().pattern(/^[0-9]{11}$/).required(),
  birthday: joi.date().iso().required()
});

export default customerSchema;