const Joi = require('joi');

const createInventorySchema = Joi.object({
  sku: Joi.string().max(100).required(),
  name: Joi.string().max(255).required(),
  description: Joi.string().max(1000).optional(),
  batch_number: Joi.string().max(100).optional(),
  expiry_date: Joi.date().iso().greater('now').optional(),
  unit: Joi.string().max(50).optional(),
  quantity: Joi.number().integer().min(0).default(0),
  location: Joi.string().max(150).optional(),
});

const updateInventorySchema = Joi.object({
  sku: Joi.string().max(100).optional(),
  name: Joi.string().max(255).optional(),
  description: Joi.string().max(1000).optional(),
  batch_number: Joi.string().max(100).optional(),
  expiry_date: Joi.date().iso().greater('now').optional(),
  unit: Joi.string().max(50).optional(),
  quantity: Joi.number().integer().min(0).optional(),
  location: Joi.string().max(150).optional(),
}).min(1);

const inventoryQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().max(255).optional(),
  expiring_soon: Joi.boolean().optional(),
  low_stock: Joi.boolean().optional(),
  sort: Joi.string().valid('name', 'sku', 'quantity', 'expiry_date', 'created_at').default('created_at'),
  order: Joi.string().valid('asc', 'desc').default('desc'),
});

module.exports = {
  createInventorySchema,
  updateInventorySchema,
  inventoryQuerySchema,
};
