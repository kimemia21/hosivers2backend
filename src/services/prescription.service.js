const db = require('../config/database');
const AppError = require('../utils/AppError');
const { createAuditLog } = require('../middlewares/audit');

/**
 * Create prescription with items (atomic transaction)
 */
const createPrescription = async (prescriptionData, userId) => {
  const { patient_id, doctor_id, notes, status, items } = prescriptionData;

  // Verify patient exists
  const patient = await db('patients')
    .where({ id: patient_id, deleted_at: null })
    .first();
  if (!patient) {
    throw new AppError('Patient not found', 404);
  }

  // Verify doctor exists
  const doctor = await db('doctors').where({ id: doctor_id }).first();
  if (!doctor) {
    throw new AppError('Doctor not found', 404);
  }

  // Use transaction for atomic operation
  const result = await db.transaction(async (trx) => {
    // Create prescription
    const [prescriptionId] = await trx('prescriptions').insert({
      patient_id,
      doctor_id,
      notes,
      status: status || 'active',
    });

    // Process prescription items
    for (const item of items) {
      // If inventory_id provided, check stock and decrement
      if (item.inventory_id) {
        const inventoryItem = await trx('inventory')
          .where({ id: item.inventory_id })
          .first();

        if (!inventoryItem) {
          throw new AppError(`Inventory item ${item.inventory_id} not found`, 404);
        }

        if (item.quantity && inventoryItem.quantity < item.quantity) {
          throw new AppError(
            `Insufficient stock for ${inventoryItem.name}. Available: ${inventoryItem.quantity}, Required: ${item.quantity}`,
            400
          );
        }

        // Decrement inventory
        if (item.quantity) {
          await trx('inventory')
            .where({ id: item.inventory_id })
            .decrement('quantity', item.quantity);
        }
      }

      // Create prescription item
      await trx('prescription_items').insert({
        prescription_id: prescriptionId,
        inventory_id: item.inventory_id || null,
        med_name: item.med_name,
        dose: item.dose,
        frequency: item.frequency,
        route: item.route,
        quantity: item.quantity,
        instructions: item.instructions,
      });
    }

    // Create audit log
    await createAuditLog(userId, 'CREATE', 'prescription', prescriptionId, prescriptionData);

    return prescriptionId;
  });

  // Fetch and return created prescription with items
  return await getPrescriptionById(result);
};

/**
 * Get prescription by ID with items
 */
const getPrescriptionById = async (id) => {
  const prescription = await db('prescriptions')
    .join('patients', 'prescriptions.patient_id', 'patients.id')
    .join('doctors', 'prescriptions.doctor_id', 'doctors.id')
    .join('users', 'doctors.user_id', 'users.id')
    .where('prescriptions.id', id)
    .select(
      'prescriptions.*',
      db.raw('CONCAT(patients.first_name, " ", patients.last_name) as patient_name'),
      'users.name as doctor_name'
    )
    .first();

  if (!prescription) {
    throw new AppError('Prescription not found', 404);
  }

  // Get prescription items
  prescription.items = await db('prescription_items')
    .leftJoin('inventory', 'prescription_items.inventory_id', 'inventory.id')
    .where('prescription_id', id)
    .select(
      'prescription_items.*',
      'inventory.sku',
      'inventory.batch_number'
    );

  return prescription;
};

/**
 * Update prescription
 */
const updatePrescription = async (id, updateData, userId) => {
  const prescription = await db('prescriptions').where({ id }).first();
  if (!prescription) {
    throw new AppError('Prescription not found', 404);
  }

  await db('prescriptions')
    .where({ id })
    .update({
      ...updateData,
      updated_at: db.fn.now(),
    });

  // Create audit log
  await createAuditLog(userId, 'UPDATE', 'prescription', id, updateData);

  return await getPrescriptionById(id);
};

/**
 * Get all prescriptions with pagination
 */
const getAllPrescriptions = async (query) => {
  const { page = 1, limit = 10, status, patient_id, doctor_id } = query;
  const offset = (page - 1) * limit;

  let queryBuilder = db('prescriptions')
    .join('patients', 'prescriptions.patient_id', 'patients.id')
    .join('doctors', 'prescriptions.doctor_id', 'doctors.id')
    .join('users', 'doctors.user_id', 'users.id');

  // Filters
  if (status) {
    queryBuilder = queryBuilder.where('prescriptions.status', status);
  }
  if (patient_id) {
    queryBuilder = queryBuilder.where('prescriptions.patient_id', patient_id);
  }
  if (doctor_id) {
    queryBuilder = queryBuilder.where('prescriptions.doctor_id', doctor_id);
  }

  // Get total count (fixed)
  const countResult = await queryBuilder.clone().count('prescriptions.id as total');
  const total = countResult[0].total;

  // Get paginated results with proper select
  const prescriptions = await queryBuilder.clone()
    .select(
      'prescriptions.id',
      'prescriptions.patient_id',
      'prescriptions.doctor_id',
      'prescriptions.issue_date',
      'prescriptions.status',
      db.raw('CONCAT(patients.first_name, " ", patients.last_name) as patient_name'),
      'users.name as doctor_name',
      'prescriptions.created_at'
    )
    .orderBy('prescriptions.created_at', 'desc')
    .limit(limit)
    .offset(offset);

  // Get item count for each prescription
  for (let prescription of prescriptions) {
    const itemCountResult = await db('prescription_items')
      .where('prescription_id', prescription.id)
      .count('* as count');
    prescription.items_count = itemCountResult[0].count;
  }

  return {
    data: prescriptions,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: parseInt(total),
      pages: Math.ceil(total / limit),
    },
  };
};

module.exports = {
  createPrescription,
  getPrescriptionById,
  updatePrescription,
  getAllPrescriptions,
};
