const db = require('../config/database');
const AppError = require('../utils/AppError');

/**
 * Get all inventory items with pagination and filters
 */
const getAllInventory = async (query) => {
  const {
    page = 1,
    limit = 10,
    search,
    expiring_soon,
    low_stock,
    sort = 'created_at',
    order = 'desc',
  } = query;
  const offset = (page - 1) * limit;

  let queryBuilder = db('inventory');

  // Search functionality
  if (search) {
    queryBuilder = queryBuilder.where(function() {
      this.where('name', 'like', `%${search}%`)
        .orWhere('sku', 'like', `%${search}%`)
        .orWhere('description', 'like', `%${search}%`);
    });
  }

  // Filter: Expiring soon (within 90 days)
  if (expiring_soon === 'true' || expiring_soon === true) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 90);
    queryBuilder = queryBuilder
      .whereNotNull('expiry_date')
      .where('expiry_date', '<=', futureDate.toISOString().split('T')[0]);
  }

  // Filter: Low stock (quantity < 100)
  if (low_stock === 'true' || low_stock === true) {
    queryBuilder = queryBuilder.where('quantity', '<', 100);
  }

  // Get total count (fixed)
  const countResult = await queryBuilder.clone().count('* as total');
  const total = countResult[0].total;

  // Get paginated results with proper select
  const inventory = await queryBuilder.clone()
    .select('*')
    .orderBy(sort, order)
    .limit(limit)
    .offset(offset);

  return {
    data: inventory,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: parseInt(total),
      pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get inventory item by ID
 */
const getInventoryById = async (id) => {
  const item = await db('inventory').where({ id }).first();

  if (!item) {
    throw new AppError('Inventory item not found', 404);
  }

  return item;
};

/**
 * Create inventory item
 */
const createInventory = async (inventoryData) => {
  // Check if SKU already exists
  const existing = await db('inventory').where({ sku: inventoryData.sku }).first();
  if (existing) {
    throw new AppError('SKU already exists', 409);
  }

  const [inventoryId] = await db('inventory').insert(inventoryData);

  return await getInventoryById(inventoryId);
};

/**
 * Update inventory item
 */
const updateInventory = async (id, inventoryData) => {
  const item = await getInventoryById(id);

  // If updating SKU, check uniqueness
  if (inventoryData.sku && inventoryData.sku !== item.sku) {
    const existing = await db('inventory').where({ sku: inventoryData.sku }).first();
    if (existing) {
      throw new AppError('SKU already exists', 409);
    }
  }

  await db('inventory')
    .where({ id })
    .update({
      ...inventoryData,
      updated_at: db.fn.now(),
    });

  return await getInventoryById(id);
};

/**
 * Delete inventory item
 */
const deleteInventory = async (id) => {
  const item = await getInventoryById(id);

  // Check if item is referenced in prescriptions
  const prescriptionItems = await db('prescription_items')
    .where({ inventory_id: id })
    .first();

  if (prescriptionItems) {
    throw new AppError(
      'Cannot delete inventory item that is referenced in prescriptions',
      400
    );
  }

  await db('inventory').where({ id }).delete();

  return { message: 'Inventory item deleted successfully' };
};

module.exports = {
  getAllInventory,
  getInventoryById,
  createInventory,
  updateInventory,
  deleteInventory,
};
