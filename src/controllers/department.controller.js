const departmentService = require('../services/department.service');
const catchAsync = require('../utils/catchAsync');

/**
 * Get all departments
 * GET /departments
 */
const getAllDepartments = catchAsync(async (req, res) => {
  const departments = await departmentService.getAllDepartments();

  res.status(200).json({
    status: 'success',
    data: departments,
  });
});

/**
 * Get department by ID
 * GET /departments/:id
 */
const getDepartment = catchAsync(async (req, res) => {
  const department = await departmentService.getDepartmentById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: department,
  });
});

/**
 * Create department
 * POST /departments
 */
const createDepartment = catchAsync(async (req, res) => {
  const department = await departmentService.createDepartment(req.body);

  res.status(201).json({
    status: 'success',
    message: 'Department created successfully',
    data: department,
  });
});

/**
 * Update department
 * PUT /departments/:id
 */
const updateDepartment = catchAsync(async (req, res) => {
  const department = await departmentService.updateDepartment(
    req.params.id,
    req.body
  );

  res.status(200).json({
    status: 'success',
    message: 'Department updated successfully',
    data: department,
  });
});

/**
 * Delete department
 * DELETE /departments/:id
 */
const deleteDepartment = catchAsync(async (req, res) => {
  const result = await departmentService.deleteDepartment(req.params.id);

  res.status(200).json({
    status: 'success',
    ...result,
  });
});

module.exports = {
  getAllDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
