const doctorService = require('../services/doctor.service');
const catchAsync = require('../utils/catchAsync');

/**
 * Get all doctors
 * GET /doctors
 */
const getAllDoctors = catchAsync(async (req, res) => {
  const doctors = await doctorService.getAllDoctors();

  res.status(200).json({
    status: 'success',
    data: doctors,
  });
});

/**
 * Get doctor by ID
 * GET /doctors/:id
 */
const getDoctor = catchAsync(async (req, res) => {
  const doctor = await doctorService.getDoctorById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: doctor,
  });
});

/**
 * Create doctor
 * POST /doctors
 */
const createDoctor = catchAsync(async (req, res) => {
  const doctor = await doctorService.createDoctor(req.body);

  res.status(201).json({
    status: 'success',
    message: 'Doctor created successfully',
    data: doctor,
  });
});

/**
 * Update doctor
 * PUT /doctors/:id
 */
const updateDoctor = catchAsync(async (req, res) => {
  const doctor = await doctorService.updateDoctor(req.params.id, req.body);

  res.status(200).json({
    status: 'success',
    message: 'Doctor updated successfully',
    data: doctor,
  });
});

/**
 * Delete doctor
 * DELETE /doctors/:id
 */
const deleteDoctor = catchAsync(async (req, res) => {
  const result = await doctorService.deleteDoctor(req.params.id);

  res.status(200).json({
    status: 'success',
    ...result,
  });
});

module.exports = {
  getAllDoctors,
  getDoctor,
  createDoctor,
  updateDoctor,
  deleteDoctor,
};
