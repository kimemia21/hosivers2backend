const express = require('express');
const router = express.Router();
const auditController = require('../controllers/audit.controller');
const { authenticate, authorize } = require('../middlewares/auth');

// All routes require authentication and admin role
router.use(authenticate);
router.use(authorize('admin'));

// Routes
router.get('/logs', auditController.getAuditLogs);

module.exports = router;
