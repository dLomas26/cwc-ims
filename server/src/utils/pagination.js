const { PAGINATION } = require('../constants');

/**
 * Parse pagination params from query string
 */
const parsePagination = (query) => {
  const page = Math.max(1, parseInt(query.page) || PAGINATION.DEFAULT_PAGE);
  const limit = Math.min(
    parseInt(query.limit) || PAGINATION.DEFAULT_LIMIT,
    PAGINATION.MAX_LIMIT
  );
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

/**
 * Build pagination meta for response
 */
const buildPaginationMeta = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

/**
 * Build a SQL search condition for fuzzy partial matching
 * Uses ILIKE with % wildcards
 * @param {string} searchTerm - the search string
 * @param {string[]} columns - columns to search across
 * @param {number} startParamIndex - starting $N index for params
 * @returns {{ clause: string, params: any[] }}
 */
const buildSearchClause = (searchTerm, columns, startParamIndex = 1) => {
  if (!searchTerm || !searchTerm.trim()) {
    return { clause: '', params: [] };
  }

  const term = `%${searchTerm.trim()}%`;
  const conditions = columns.map((col, i) => `${col} ILIKE $${startParamIndex + i}`);
  const clause = `(${conditions.join(' OR ')})`;
  const params = columns.map(() => term);

  return { clause, params };
};

module.exports = { parsePagination, buildPaginationMeta, buildSearchClause };
