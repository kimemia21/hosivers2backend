const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/department.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validation');
const {
  createDepartmentSchema,
  updateDepartmentSchema,
} = require('../validators/department.validator');

// All routes require authentication
router.use(authenticate);

// Routes
router
  .route('/')
  .get(
    authorize('admin', 'doctor', 'receptionist'),
    departmentController.getAllDepartments
  )
  .post(
    authorize('admin'),
    validate(createDepartmentSchema),
    departmentController.createDepartment
  );

router
  .route('/:id')
  .get(
    authorize('admin', 'doctor', 'receptionist'),
    departmentController.getDepartment
  )
  .put(
    authorize('admin'),
    validate(updateDepartmentSchema),
    departmentController.updateDepartment
  )
  .delete(
    authorize('admin'),
    departmentController.deleteDepartment
  );

module.exports = router;
