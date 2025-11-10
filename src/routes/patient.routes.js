const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patient.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const { auditMiddleware } = require('../middlewares/audit');
const validate = require('../middlewares/validation');
const {
  createPatientSchema,
  updatePatientSchema,
  paginationSchema,
} = require('../validators/patient.validator');

// All routes require authentication
router.use(authenticate);

// Routes
router
  .route('/')
  .get(
    authorize('admin', 'doctor', 'receptionist'),
    validate(paginationSchema, 'query'),
    patientController.getAllPatients
  )
  .post(
    authorize('admin', 'doctor', 'receptionist'),
    validate(createPatientSchema),
    auditMiddleware('patient'),
    patientController.createPatient
  );

router
  .route('/:id')
  .get(
    authorize('admin', 'doctor', 'receptionist'),
    patientController.getPatient
  )
  .put(
    authorize('admin', 'doctor', 'receptionist'),
    validate(updatePatientSchema),
    auditMiddleware('patient'),
    patientController.updatePatient
  )
  .delete(
    authorize('admin'),
    auditMiddleware('patient'),
    patientController.deletePatient
  );

// Patient records
router
  .route('/:id/records')
  .get(
    authorize('admin', 'doctor'),
    patientController.getPatientRecords
  );

module.exports = router;
