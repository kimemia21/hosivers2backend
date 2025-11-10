const Joi = require('joi');

const createDoctorSchema = Joi.object({
  user_id: Joi.number().integer().positive().required(),
  department_id: Joi.number().integer().positive().optional(),
  license_number: Joi.string().max(100).optional(),
  specialization: Joi.string().max(150).optional(),
  phone: Joi.string().max(50).optional(),
});

const updateDoctorSchema = Joi.object({
  department_id: Joi.number().integer().positive().optional(),
  license_number: Joi.string().max(100).optional(),
  specialization: Joi.string().max(150).optional(),
  phone: Joi.string().max(50).optional(),
}).min(1);

module.exports = {
  createDoctorSchema,
  updateDoctorSchema,
};
