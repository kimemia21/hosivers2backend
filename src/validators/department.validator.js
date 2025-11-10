const Joi = require('joi');

const createDepartmentSchema = Joi.object({
  name: Joi.string().min(1).max(150).required(),
  description: Joi.string().max(1000).optional(),
});

const updateDepartmentSchema = Joi.object({
  name: Joi.string().min(1).max(150).optional(),
  description: Joi.string().max(1000).optional(),
}).min(1);

module.exports = {
  createDepartmentSchema,
  updateDepartmentSchema,
};
