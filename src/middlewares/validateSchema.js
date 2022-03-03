export function validateSchema(schema) {
  return (req, res, next) => {
    const validateResult = schema.validate(req.body, { abortEarly: false });

    if (validateResult.error) {
      const message = validateResult.error.details.map(d => d.message);
      return res.status(400).send(message.join(", "));
    }

    next();
  }
}