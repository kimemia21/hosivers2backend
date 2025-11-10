const Joi = require('joi');

const createPatientSchema = Joi.object({
  first_name: Joi.string().min(1).max(150).required(),
  last_name: Joi.string().min(1).max(150).required(),
  dob: Joi.date().iso().max('now').optional(),
  gender: Joi.string().valid('male', 'female', 'other').optional(),
  national_id: Joi.string().max(100).optional(),
  phone: Joi.string().max(50).optional(),
  email: Joi.string().email().max(255).optional(),
  address: Joi.string().max(500).optional(),
  emergency_contact_name: Joi.string().max(200).optional(),
  emergency_contact_phone: Joi.string().max(50).optional(),
  allergies: Joi.string().max(1000).optional(),
  known_conditions: Joi.string().max(1000).optional(),
});

const updatePatientSchema = Joi.object({
  first_name: Joi.string().min(1).max(150).optional(),
  last_name: Joi.string().min(1).max(150).optional(),
  dob: Joi.date().iso().max('now').optional(),
  gender: Joi.string().valid('male', 'female', 'other').optional(),
  national_id: Joi.string().max(100).optional(),
  phone: Joi.string().max(50).optional(),
  email: Joi.string().email().max(255).optional(),
  address: Joi.string().max(500).optional(),
  emergency_contact_name: Joi.string().max(200).optional(),
  emergency_contact_phone: Joi.string().max(50).optional(),
  allergies: Joi.string().max(1000).optional(),
  known_conditions: Joi.string().max(1000).optional(),
}).min(1);

const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().max(255).optional(),
  sort: Joi.string().valid('first_name', 'last_name', 'dob', 'gender', 'email', 'phone', 'created_at', 'updated_at').default('created_at'),
  order: Joi.string().valid('asc', 'desc').default('desc'),
});

module.exports = {
  createPatientSchema,
  updatePatientSchema,
  paginationSchema,
};
