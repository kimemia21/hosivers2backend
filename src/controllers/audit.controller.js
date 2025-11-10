const auditService = require('../services/audit.service');
const catchAsync = require('../utils/catchAsync');

/**
 * Get audit logs
 * GET /audit/logs
 */
const getAuditLogs = catchAsync(async (req, res) => {
  const result = await auditService.getAuditLogs(req.query);

  res.status(200).json({
    status: 'success',
    ...result,
  });
});

module.exports = {
  getAuditLogs,
};
