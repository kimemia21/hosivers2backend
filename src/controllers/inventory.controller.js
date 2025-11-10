const inventoryService = require('../services/inventory.service');
const catchAsync = require('../utils/catchAsync');

/**
 * Get all inventory
 * GET /inventory
 */
const getAllInventory = catchAsync(async (req, res) => {
  const result = await inventoryService.getAllInventory(req.query);

  res.status(200).json({
    status: 'success',
    ...result,
  });
});

/**
 * Get inventory by ID
 * GET /inventory/:id
 */
const getInventory = catchAsync(async (req, res) => {
  const item = await inventoryService.getInventoryById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: item,
  });
});

/**
 * Create inventory item
 * POST /inventory
 */
const createInventory = catchAsync(async (req, res) => {
  const item = await inventoryService.createInventory(req.body);

  res.status(201).json({
    status: 'success',
    message: 'Inventory item created successfully',
    data: item,
  });
});

/**
 * Update inventory item
 * PUT /inventory/:id
 */
const updateInventory = catchAsync(async (req, res) => {
  const item = await inventoryService.updateInventory(req.params.id, req.body);

  res.status(200).json({
    status: 'success',
    message: 'Inventory item updated successfully',
    data: item,
  });
});

/**
 * Delete inventory item
 * DELETE /inventory/:id
 */
const deleteInventory = catchAsync(async (req, res) => {
  const result = await inventoryService.deleteInventory(req.params.id);

  res.status(200).json({
    status: 'success',
    ...result,
  });
});

module.exports = {
  getAllInventory,
  getInventory,
  createInventory,
  updateInventory,
  deleteInventory,
};
