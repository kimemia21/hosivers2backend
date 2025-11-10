const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(200).required()
    .messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 200 characters',
      'any.required': 'Name is required',
    }),
  email: Joi.string().email().max(255).required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      'any.required': 'Password is required',
    }),
  role: Joi.string()
    .valid('admin', 'doctor', 'pharmacist', 'receptionist')
    .default('receptionist')
    .messages({
      'any.only': 'Role must be one of: admin, doctor, pharmacist, receptionist',
    }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
  password: Joi.string().required()
    .messages({
      'any.required': 'Password is required',
    }),
});

module.exports = {
  registerSchema,
  loginSchema,
};
