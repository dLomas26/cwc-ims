const categoryRepository = require('../repositories/categoryRepository');
const ApiError = require('../utils/ApiError');

/**
 * Category Service
 * Business logic for category and field management
 */

/**
 * Get all categories with field counts
 * @returns {Object[]}
 */
const getAll = async () => {
  return categoryRepository.findAll();
};

/**
 * Get a category with all its custom fields
 * @param {string} id
 * @returns {Object}
 */
const getWithFields = async (id) => {
  const category = await categoryRepository.findWithFields(id);
  if (!category) {
    throw ApiError.notFound(`Category with ID ${id} not found`);
  }
  return category;
};

/**
 * Create a new category
 * @param {Object} data
 * @param {string} userId
 * @returns {Object}
 */
const create = async (data, userId) => {
  const category = await categoryRepository.create({ ...data, created_by: userId });
  return category;
};

/**
 * Update a category
 * @param {string} id
 * @param {Object} data
 * @returns {Object}
 */
const update = async (id, data) => {
  const existing = await categoryRepository.findById(id);
  if (!existing) {
    throw ApiError.notFound(`Category with ID ${id} not found`);
  }
  const updated = await categoryRepository.update(id, data);
  return updated;
};

/**
 * Delete a category
 * Blocked if any assets belong to this category
 * @param {string} id
 */
const deleteCategory = async (id) => {
  const existing = await categoryRepository.findById(id);
  if (!existing) {
    throw ApiError.notFound(`Category with ID ${id} not found`);
  }

  const assetCount = await categoryRepository.countAssets(id);
  if (assetCount > 0) {
    throw ApiError.conflict(
      `Cannot delete category "${existing.name}" because it has ${assetCount} asset(s) associated with it. Please reassign or delete those assets first.`
    );
  }

  await categoryRepository.deleteCategory(id);
};

/**
 * Get fields for a category
 * @param {string} categoryId
 * @returns {Object[]}
 */
const getFields = async (categoryId) => {
  const category = await categoryRepository.findById(categoryId);
  if (!category) {
    throw ApiError.notFound(`Category with ID ${categoryId} not found`);
  }
  return categoryRepository.getFields(categoryId);
};

/**
 * Add a custom field to a category
 * @param {string} categoryId
 * @param {Object} data
 * @returns {Object}
 */
const addField = async (categoryId, data) => {
  const category = await categoryRepository.findById(categoryId);
  if (!category) {
    throw ApiError.notFound(`Category with ID ${categoryId} not found`);
  }

  // Ensure field_name is unique within this category
  const existingFields = await categoryRepository.getFields(categoryId);
  const duplicate = existingFields.find((f) => f.field_name === data.field_name);
  if (duplicate) {
    throw ApiError.conflict(`Field with name "${data.field_name}" already exists in this category`);
  }

  return categoryRepository.addField(categoryId, data);
};

/**
 * Update a custom field
 * @param {string} categoryId
 * @param {string} fieldId
 * @param {Object} data
 * @returns {Object}
 */
const updateField = async (categoryId, fieldId, data) => {
  // Verify both category and field exist
  const category = await categoryRepository.findById(categoryId);
  if (!category) {
    throw ApiError.notFound(`Category with ID ${categoryId} not found`);
  }

  const fields = await categoryRepository.getFields(categoryId);
  const field = fields.find((f) => f.id === fieldId);
  if (!field) {
    throw ApiError.notFound(`Field with ID ${fieldId} not found in this category`);
  }

  return categoryRepository.updateField(fieldId, data);
};

/**
 * Delete a custom field
 * @param {string} categoryId
 * @param {string} fieldId
 */
const deleteField = async (categoryId, fieldId) => {
  const category = await categoryRepository.findById(categoryId);
  if (!category) {
    throw ApiError.notFound(`Category with ID ${categoryId} not found`);
  }

  const fields = await categoryRepository.getFields(categoryId);
  const field = fields.find((f) => f.id === fieldId);
  if (!field) {
    throw ApiError.notFound(`Field with ID ${fieldId} not found in this category`);
  }

  await categoryRepository.deleteField(fieldId);
};

module.exports = { getAll, getWithFields, create, update, deleteCategory, getFields, addField, updateField, deleteField };
