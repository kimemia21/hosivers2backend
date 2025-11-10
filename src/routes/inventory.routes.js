const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventory.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validation');
const {
  createInventorySchema,
  updateInventorySchema,
  inventoryQuerySchema,
} = require('../validators/inventory.validator');

// All routes require authentication
router.use(authenticate);

// Routes
router
  .route('/')
  .get(
    authorize('admin', 'doctor', 'pharmacist'),
    validate(inventoryQuerySchema, 'query'),
    inventoryController.getAllInventory
  )
  .post(
    authorize('admin', 'pharmacist'),
    validate(createInventorySchema),
    inventoryController.createInventory
  );

router
  .route('/:id')
  .get(
    authorize('admin', 'doctor', 'pharmacist'),
    inventoryController.getInventory
  )
  .put(
    authorize('admin', 'pharmacist'),
    validate(updateInventorySchema),
    inventoryController.updateInventory
  )
  .delete(
    authorize('admin'),
    inventoryController.deleteInventory
  );

module.exports = router;
