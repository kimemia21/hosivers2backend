const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const patientRoutes = require('./patient.routes');
const prescriptionRoutes = require('./prescription.routes');
const inventoryRoutes = require('./inventory.routes');
const departmentRoutes = require('./department.routes');
const doctorRoutes = require('./doctor.routes');
const auditRoutes = require('./audit.routes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/patients', patientRoutes);
router.use('/prescriptions', prescriptionRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/departments', departmentRoutes);
router.use('/doctors', doctorRoutes);
router.use('/audit', auditRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
