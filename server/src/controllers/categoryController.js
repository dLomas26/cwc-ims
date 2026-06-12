const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendCreated } = require('../utils/ApiResponse');
const categoryService = require('../services/categoryService');

/**
 * Category Controller
 */

/** GET /api/categories */
const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.getAll();
  sendSuccess(res, categories, 'Categories retrieved successfully');
});

/** GET /api/categories/:id */
const getCategoryById = asyncHandler(async (req, res) => {
  const category = await categoryService.getWithFields(req.params.id);
  sendSuccess(res, category, 'Category retrieved successfully');
});

/** POST /api/categories */
const createCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.create(req.body, req.user.id);
  sendCreated(res, category, 'Category created successfully');
});

/** PUT /api/categories/:id */
const updateCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.update(req.params.id, req.body);
  sendSuccess(res, category, 'Category updated successfully');
});

/** DELETE /api/categories/:id */
const deleteCategory = asyncHandler(async (req, res) => {
  await categoryService.deleteCategory(req.params.id);
  sendSuccess(res, null, 'Category deleted successfully');
});

/** GET /api/categories/:id/fields */
const getCategoryFields = asyncHandler(async (req, res) => {
  const fields = await categoryService.getFields(req.params.id);
  sendSuccess(res, fields, 'Category fields retrieved');
});

/** POST /api/categories/:id/fields */
const addCategoryField = asyncHandler(async (req, res) => {
  const field = await categoryService.addField(req.params.id, req.body);
  sendCreated(res, field, 'Field added successfully');
});

/** PUT /api/categories/:id/fields/:fieldId */
const updateCategoryField = asyncHandler(async (req, res) => {
  const field = await categoryService.updateField(req.params.id, req.params.fieldId, req.body);
  sendSuccess(res, field, 'Field updated successfully');
});

/** DELETE /api/categories/:id/fields/:fieldId */
const deleteCategoryField = asyncHandler(async (req, res) => {
  await categoryService.deleteField(req.params.id, req.params.fieldId);
  sendSuccess(res, null, 'Field deleted successfully');
});

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryFields,
  addCategoryField,
  updateCategoryField,
  deleteCategoryField,
};
