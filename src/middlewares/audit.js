const db = require('../config/database');
const logger = require('../utils/logger');

/**
 * Create audit log entry
 * @param {number} userId - User ID performing the action
 * @param {string} action - Action performed (CREATE, UPDATE, DELETE)
 * @param {string} objectType - Type of object (patient, prescription, etc.)
 * @param {number} objectId - ID of the object
 * @param {object} changes - Changes made to the object
 */
const createAuditLog = async (userId, action, objectType, objectId, changes = null) => {
  try {
    await db('audit_logs').insert({
      user_id: userId,
      action,
      object_type: objectType,
      object_id: objectId,
      changes: changes ? JSON.stringify(changes) : null,
    });
  } catch (error) {
    // Don't fail the request if audit log fails, but log the error
    logger.error('Failed to create audit log:', error);
  }
};

/**
 * Middleware to automatically audit PHI access
 * Logs all CREATE, UPDATE, DELETE operations on sensitive tables
 */
const auditMiddleware = (objectType) => {
  return async (req, res, next) => {
    // Store original json method
    const originalJson = res.json.bind(res);

    // Override json method to capture response
    res.json = function (data) {
      // Only audit successful operations (2xx status codes)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const userId = req.user?.id;
        const method = req.method;
        
        let action;
        if (method === 'POST') action = 'CREATE';
        else if (method === 'PUT' || method === 'PATCH') action = 'UPDATE';
        else if (method === 'DELETE') action = 'DELETE';

        // Only audit write operations
        if (action && userId) {
          const objectId = req.params.id || data?.data?.id;
          const changes = method !== 'DELETE' ? req.body : null;

          // Create audit log asynchronously (don't await)
          createAuditLog(userId, action, objectType, objectId, changes)
            .catch(err => logger.error('Audit log error:', err));
        }
      }

      // Call original json method
      return originalJson(data);
    };

    next();
  };
};

module.exports = {
  createAuditLog,
  auditMiddleware,
};
