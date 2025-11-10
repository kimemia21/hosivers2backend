const db = require('../config/database');

/**
 * Get audit logs with pagination
 */
const getAuditLogs = async (query) => {
  const {
    page = 1,
    limit = 50,
    user_id,
    action,
    object_type,
    start_date,
    end_date,
  } = query;
  const offset = (page - 1) * limit;

  let queryBuilder = db('audit_logs')
    .leftJoin('users', 'audit_logs.user_id', 'users.id')
    .select(
      'audit_logs.*',
      'users.name as user_name',
      'users.email as user_email',
      'users.role as user_role'
    );

  // Filters
  if (user_id) {
    queryBuilder = queryBuilder.where('audit_logs.user_id', user_id);
  }
  if (action) {
    queryBuilder = queryBuilder.where('audit_logs.action', action);
  }
  if (object_type) {
    queryBuilder = queryBuilder.where('audit_logs.object_type', object_type);
  }
  if (start_date) {
    queryBuilder = queryBuilder.where('audit_logs.created_at', '>=', start_date);
  }
  if (end_date) {
    queryBuilder = queryBuilder.where('audit_logs.created_at', '<=', end_date);
  }

  // Get total count
  const [{ total }] = await queryBuilder.clone().count('* as total');

  // Get paginated results
  const logs = await queryBuilder
    .orderBy('audit_logs.created_at', 'desc')
    .limit(limit)
    .offset(offset);

  return {
    data: logs,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: parseInt(total),
      pages: Math.ceil(total / limit),
    },
  };
};

module.exports = {
  getAuditLogs,
};
