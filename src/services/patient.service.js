const db = require('../config/database');
const AppError = require('../utils/AppError');
const { createAuditLog } = require('../middlewares/audit');

/**
 * Get all patients with pagination and search
 */
const getAllPatients = async (query) => {
  const { page = 1, limit = 10, search, sort = 'created_at', order = 'desc' } = query;
  const offset = (page - 1) * limit;

  let queryBuilder = db('patients')
    .where({ deleted_at: null });

  // Search functionality
  if (search) {
    queryBuilder = queryBuilder.where(function() {
      this.where('first_name', 'like', `%${search}%`)
        .orWhere('last_name', 'like', `%${search}%`)
        .orWhere('phone', 'like', `%${search}%`)
        .orWhere('email', 'like', `%${search}%`);
    });
  }

  // Get total count (fixed)
  const countResult = await queryBuilder.clone().count('* as total');
  const total = countResult[0].total;

  // Get paginated results with proper select
  const patients = await queryBuilder.clone()
    .select(
      'id',
      'first_name',
      'last_name',
      'dob',
      'gender',
      'phone',
      'email',
      'allergies',
      'known_conditions',
      'created_at'
    )
    .orderBy(sort, order)
    .limit(limit)
    .offset(offset);

  return {
    data: patients,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: parseInt(total),
      pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get single patient by ID
 */
const getPatientById = async (id) => {
  const patient = await db('patients')
    .where({ id, deleted_at: null })
    .first();

  if (!patient) {
    throw new AppError('Patient not found', 404);
  }

  return patient;
};

/**
 * Create new patient
 */
const createPatient = async (patientData, userId) => {
  const [patientId] = await db('patients').insert(patientData);

  // Create audit log
  await createAuditLog(userId, 'CREATE', 'patient', patientId, patientData);

  return await getPatientById(patientId);
};

/**
 * Update patient
 */
const updatePatient = async (id, patientData, userId) => {
  const patient = await getPatientById(id);

  await db('patients')
    .where({ id })
    .update({
      ...patientData,
      updated_at: db.fn.now(),
    });

  // Create audit log
  await createAuditLog(userId, 'UPDATE', 'patient', id, patientData);

  return await getPatientById(id);
};

/**
 * Soft delete patient
 */
const deletePatient = async (id, userId) => {
  const patient = await getPatientById(id);

  await db('patients')
    .where({ id })
    .update({ deleted_at: db.fn.now() });

  // Create audit log
  await createAuditLog(userId, 'DELETE', 'patient', id, null);

  return { message: 'Patient deleted successfully' };
};

/**
 * Get patient records (prescriptions and encounters)
 */
const getPatientRecords = async (patientId) => {
  const patient = await getPatientById(patientId);

  const prescriptions = await db('prescriptions')
    .join('doctors', 'prescriptions.doctor_id', 'doctors.id')
    .join('users', 'doctors.user_id', 'users.id')
    .where('prescriptions.patient_id', patientId)
    .select(
      'prescriptions.id',
      'prescriptions.issue_date',
      'prescriptions.notes',
      'prescriptions.status',
      'users.name as doctor_name',
      'doctors.specialization'
    )
    .orderBy('prescriptions.issue_date', 'desc');

  // Get prescription items for each prescription
  for (let prescription of prescriptions) {
    prescription.items = await db('prescription_items')
      .where('prescription_id', prescription.id)
      .select('med_name', 'dose', 'frequency', 'route', 'quantity', 'instructions');
  }

  return {
    patient,
    prescriptions,
  };
};

module.exports = {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  getPatientRecords,
};
