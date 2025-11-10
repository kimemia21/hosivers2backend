const db = require('../config/database');
const AppError = require('../utils/AppError');

/**
 * Get all doctors
 */
const getAllDoctors = async () => {
  return await db('doctors')
    .join('users', 'doctors.user_id', 'users.id')
    .leftJoin('departments', 'doctors.department_id', 'departments.id')
    .where('users.deleted_at', null)
    .select(
      'doctors.id',
      'doctors.user_id',
      'users.name',
      'users.email',
      'doctors.license_number',
      'doctors.specialization',
      'doctors.phone',
      'departments.name as department_name',
      'doctors.created_at'
    )
    .orderBy('users.name', 'asc');
};

/**
 * Get doctor by ID
 */
const getDoctorById = async (id) => {
  const doctor = await db('doctors')
    .join('users', 'doctors.user_id', 'users.id')
    .leftJoin('departments', 'doctors.department_id', 'departments.id')
    .where('doctors.id', id)
    .where('users.deleted_at', null)
    .select(
      'doctors.*',
      'users.name',
      'users.email',
      'users.role',
      'departments.name as department_name'
    )
    .first();

  if (!doctor) {
    throw new AppError('Doctor not found', 404);
  }

  return doctor;
};

/**
 * Create doctor profile
 */
const createDoctor = async (doctorData) => {
  // Verify user exists and has doctor role
  const user = await db('users')
    .where({ id: doctorData.user_id, deleted_at: null })
    .first();

  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (user.role !== 'doctor') {
    throw new AppError('User must have doctor role', 400);
  }

  // Check if doctor profile already exists for this user
  const existing = await db('doctors')
    .where({ user_id: doctorData.user_id })
    .first();

  if (existing) {
    throw new AppError('Doctor profile already exists for this user', 409);
  }

  // Verify department exists if provided
  if (doctorData.department_id) {
    const department = await db('departments')
      .where({ id: doctorData.department_id })
      .first();

    if (!department) {
      throw new AppError('Department not found', 404);
    }
  }

  const [doctorId] = await db('doctors').insert(doctorData);

  return await getDoctorById(doctorId);
};

/**
 * Update doctor
 */
const updateDoctor = async (id, doctorData) => {
  const doctor = await getDoctorById(id);

  // Verify department exists if provided
  if (doctorData.department_id) {
    const department = await db('departments')
      .where({ id: doctorData.department_id })
      .first();

    if (!department) {
      throw new AppError('Department not found', 404);
    }
  }

  await db('doctors')
    .where({ id })
    .update({
      ...doctorData,
      updated_at: db.fn.now(),
    });

  return await getDoctorById(id);
};

/**
 * Delete doctor
 */
const deleteDoctor = async (id) => {
  const doctor = await getDoctorById(id);

  // Check if doctor has prescriptions
  const prescriptions = await db('prescriptions')
    .where({ doctor_id: id })
    .first();

  if (prescriptions) {
    throw new AppError(
      'Cannot delete doctor with existing prescriptions',
      400
    );
  }

  await db('doctors').where({ id }).delete();

  return { message: 'Doctor deleted successfully' };
};

module.exports = {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
};
