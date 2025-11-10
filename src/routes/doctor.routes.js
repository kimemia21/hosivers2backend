const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctor.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validation');
const {
  createDoctorSchema,
  updateDoctorSchema,
} = require('../validators/doctor.validator');

// All routes require authentication
router.use(authenticate);

// Routes
router
  .route('/')
  .get(
    authorize('admin', 'doctor', 'receptionist'),
    doctorController.getAllDoctors
  )
  .post(
    authorize('admin'),
    validate(createDoctorSchema),
    doctorController.createDoctor
  );

router
  .route('/:id')
  .get(
    authorize('admin', 'doctor', 'receptionist'),
    doctorController.getDoctor
  )
  .put(
    authorize('admin'),
    validate(updateDoctorSchema),
    doctorController.updateDoctor
  )
  .delete(
    authorize('admin'),
    doctorController.deleteDoctor
  );

module.exports = router;
