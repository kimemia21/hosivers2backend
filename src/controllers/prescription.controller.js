const prescriptionService = require('../services/prescription.service');
const catchAsync = require('../utils/catchAsync');

/**
 * Get all prescriptions
 * GET /prescriptions
 */
const getAllPrescriptions = catchAsync(async (req, res) => {
  const result = await prescriptionService.getAllPrescriptions(req.query);

  res.status(200).json({
    status: 'success',
    ...result,
  });
});

/**
 * Get prescription by ID
 * GET /prescriptions/:id
 */
const getPrescription = catchAsync(async (req, res) => {
  const prescription = await prescriptionService.getPrescriptionById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: prescription,
  });
});

/**
 * Create prescription
 * POST /prescriptions
 */
const createPrescription = catchAsync(async (req, res) => {
  const prescription = await prescriptionService.createPrescription(
    req.body,
    req.user.id
  );

  res.status(201).json({
    status: 'success',
    message: 'Prescription created successfully',
    data: prescription,
  });
});

/**
 * Update prescription
 * PUT /prescriptions/:id
 */
const updatePrescription = catchAsync(async (req, res) => {
  const prescription = await prescriptionService.updatePrescription(
    req.params.id,
    req.body,
    req.user.id
  );

  res.status(200).json({
    status: 'success',
    message: 'Prescription updated successfully',
    data: prescription,
  });
});

module.exports = {
  getAllPrescriptions,
  getPrescription,
  createPrescription,
  updatePrescription,
};
