// ─── Application Constants ─────────────────────────────────────

const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  VIEWER: 'viewer',
};

const ASSET_STATUSES = {
  AVAILABLE: 'available',
  ASSIGNED: 'assigned',
  UNDER_REPAIR: 'under_repair',
  DAMAGED: 'damaged',
  RETIRED: 'retired',
};

const TRANSACTION_TYPES = {
  STOCK_IN: 'stock_in',
  STOCK_OUT: 'stock_out',
  DAMAGED: 'damaged',
  ISSUED: 'issued',
  RETURNED: 'returned',
};

const RETURN_CONDITIONS = {
  GOOD: 'good',
  DAMAGED: 'damaged',
};

const FIELD_TYPES = {
  TEXT: 'text',
  NUMBER: 'number',
  DATE: 'date',
  BOOLEAN: 'boolean',
  SELECT: 'select',
};

const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 25,
  MAX_LIMIT: 100,
};

const ID_PREFIXES = {
  EMPLOYEE: 'EMP',
  ASSET: 'AST',
};

module.exports = {
  ROLES,
  ASSET_STATUSES,
  TRANSACTION_TYPES,
  RETURN_CONDITIONS,
  FIELD_TYPES,
  PAGINATION,
  ID_PREFIXES,
};
