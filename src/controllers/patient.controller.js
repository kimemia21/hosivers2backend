const patientService = require('../services/patient.service');
const catchAsync = require('../utils/catchAsync');

/**
 * Get all patients
 * GET /patients
 */
const getAllPatients = catchAsync(async (req, res) => {
  const result = await patientService.getAllPatients(req.query);

  res.status(200).json({
    status: 'success',
    ...result,
  });
});

/**
 * Get patient by ID
 * GET /patients/:id
 */
const getPatient = catchAsync(async (req, res) => {
  const patient = await patientService.getPatientById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: patient,
  });
});

/**
 * Create patient
 * POST /patients
 */
const createPatient = catchAsync(async (req, res) => {
  const patient = await patientService.createPatient(req.body, req.user.id);

  res.status(201).json({
    status: 'success',
    message: 'Patient created successfully',
    data: patient,
  });
});

/**
 * Update patient
 * PUT /patients/:id
 */
const updatePatient = catchAsync(async (req, res) => {
  const patient = await patientService.updatePatient(
    req.params.id,
    req.body,
    req.user.id
  );

  res.status(200).json({
    status: 'success',
    message: 'Patient updated successfully',
    data: patient,
  });
});

/**
 * Delete patient
 * DELETE /patients/:id
 */
const deletePatient = catchAsync(async (req, res) => {
  const result = await patientService.deletePatient(req.params.id, req.user.id);

  res.status(200).json({
    status: 'success',
    ...result,
  });
});

/**
 * Get patient records
 * GET /patients/:id/records
 */
const getPatientRecords = catchAsync(async (req, res) => {
  const records = await patientService.getPatientRecords(req.params.id);

  res.status(200).json({
    status: 'success',
    data: records,
  });
});

module.exports = {
  getAllPatients,
  getPatient,
  createPatient,
  updatePatient,
  deletePatient,
  getPatientRecords,
};
