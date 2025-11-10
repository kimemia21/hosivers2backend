const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescription.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const { auditMiddleware } = require('../middlewares/audit');
const validate = require('../middlewares/validation');
const {
  createPrescriptionSchema,
  updatePrescriptionSchema,
} = require('../validators/prescription.validator');

// All routes require authentication
router.use(authenticate);

// Routes
router
  .route('/')
  .get(
    authorize('admin', 'doctor', 'pharmacist'),
    prescriptionController.getAllPrescriptions
  )
  .post(
    authorize('admin', 'doctor'),
    validate(createPrescriptionSchema),
    auditMiddleware('prescription'),
    prescriptionController.createPrescription
  );

router
  .route('/:id')
  .get(
    authorize('admin', 'doctor', 'pharmacist'),
    prescriptionController.getPrescription
  )
  .put(
    authorize('admin', 'doctor'),
    validate(updatePrescriptionSchema),
    auditMiddleware('prescription'),
    prescriptionController.updatePrescription
  );

module.exports = router;
