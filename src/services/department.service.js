const db = require('../config/database');
const AppError = require('../utils/AppError');

/**
 * Get all departments
 */
const getAllDepartments = async () => {
  return await db('departments').select('*').orderBy('name', 'asc');
};

/**
 * Get department by ID
 */
const getDepartmentById = async (id) => {
  const department = await db('departments').where({ id }).first();

  if (!department) {
    throw new AppError('Department not found', 404);
  }

  return department;
};

/**
 * Create department
 */
const createDepartment = async (departmentData) => {
  // Check if department name already exists
  const existing = await db('departments')
    .where({ name: departmentData.name })
    .first();

  if (existing) {
    throw new AppError('Department name already exists', 409);
  }

  const [departmentId] = await db('departments').insert(departmentData);

  return await getDepartmentById(departmentId);
};

/**
 * Update department
 */
const updateDepartment = async (id, departmentData) => {
  const department = await getDepartmentById(id);

  // If updating name, check uniqueness
  if (departmentData.name && departmentData.name !== department.name) {
    const existing = await db('departments')
      .where({ name: departmentData.name })
      .first();

    if (existing) {
      throw new AppError('Department name already exists', 409);
    }
  }

  await db('departments')
    .where({ id })
    .update({
      ...departmentData,
      updated_at: db.fn.now(),
    });

  return await getDepartmentById(id);
};

/**
 * Delete department
 */
const deleteDepartment = async (id) => {
  const department = await getDepartmentById(id);

  // Check if department has doctors
  const doctors = await db('doctors').where({ department_id: id }).first();
  if (doctors) {
    throw new AppError(
      'Cannot delete department with assigned doctors. Reassign doctors first.',
      400
    );
  }

  await db('departments').where({ id }).delete();

  return { message: 'Department deleted successfully' };
};

module.exports = {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
