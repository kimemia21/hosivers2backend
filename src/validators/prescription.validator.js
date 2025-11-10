const Joi = require('joi');

const prescriptionItemSchema = Joi.object({
  inventory_id: Joi.number().integer().positive().optional(),
  med_name: Joi.string().max(255).required(),
  dose: Joi.string().max(100).optional(),
  frequency: Joi.string().max(100).optional(),
  route: Joi.string().max(100).optional(),
  quantity: Joi.number().integer().min(0).optional(),
  instructions: Joi.string().max(1000).optional(),
});

const createPrescriptionSchema = Joi.object({
  patient_id: Joi.number().integer().positive().required(),
  doctor_id: Joi.number().integer().positive().required(),
  notes: Joi.string().max(2000).optional(),
  status: Joi.string().valid('active', 'completed', 'cancelled').default('active'),
  items: Joi.array().items(prescriptionItemSchema).min(1).required(),
});

const updatePrescriptionSchema = Joi.object({
  notes: Joi.string().max(2000).optional(),
  status: Joi.string().valid('active', 'completed', 'cancelled').optional(),
}).min(1);

module.exports = {
  createPrescriptionSchema,
  updatePrescriptionSchema,
};
