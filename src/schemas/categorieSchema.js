import joi from "joi";

const categorieSchema = joi.object({
  name: joi.string().required(),
});

export default categorieSchema;