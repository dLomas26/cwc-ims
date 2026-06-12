const ExcelJS = require('exceljs');

/**
 * Excel Exporter Utility
 * Creates styled Excel workbooks using ExcelJS
 */

// ─── Style Constants ─────────────────────────────────────────────
const HEADER_BG_COLOR = 'FF4F46E5'; // Indigo (#4f46e5) with FF alpha prefix
const HEADER_FONT_COLOR = 'FFFFFFFF'; // White
const ROW_ALT_BG_COLOR = 'FFF8FAFC'; // Light slate (#f8fafc)
const ROW_BG_COLOR = 'FFFFFFFF'; // White
const BORDER_COLOR = 'FFE2E8F0'; // Light border

/**
 * Create an Excel workbook with a styled data sheet
 *
 * @param {string} sheetName - Name for the worksheet tab
 * @param {Array<{header: string, key: string, width?: number}>} columns - Column definitions
 * @param {Object[]} rows - Array of data objects (keys match column.key)
 * @returns {Promise<Buffer>} Excel file buffer ready for HTTP response
 *
 * @example
 * const buffer = await createExcelWorkbook('Employees', [
 *   { header: 'Employee ID', key: 'employee_id', width: 15 },
 *   { header: 'Name', key: 'name', width: 30 },
 * ], employees);
 */
const createExcelWorkbook = async (sheetName, columns, rows) => {
  const workbook = new ExcelJS.Workbook();

  // ─── Workbook Metadata ─────────────────────────────────────────
  workbook.creator = 'CWC Inventory Management System';
  workbook.created = new Date();
  workbook.modified = new Date();

  const worksheet = workbook.addWorksheet(sheetName, {
    pageSetup: {
      paperSize: 9, // A4
      orientation: 'landscape',
      fitToPage: true,
    },
  });

  // ─── Column Definitions ────────────────────────────────────────
  worksheet.columns = columns.map((col) => ({
    header: col.header,
    key: col.key,
    width: col.width || 20,
    style: {
      font: { size: 11, name: 'Calibri' },
    },
  }));

  // ─── Style the Header Row ──────────────────────────────────────
  const headerRow = worksheet.getRow(1);
  headerRow.height = 22;

  headerRow.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: HEADER_BG_COLOR },
    };
    cell.font = {
      bold: true,
      color: { argb: HEADER_FONT_COLOR },
      size: 11,
      name: 'Calibri',
    };
    cell.alignment = {
      vertical: 'middle',
      horizontal: 'left',
      wrapText: false,
    };
    cell.border = {
      bottom: { style: 'thin', color: { argb: BORDER_COLOR } },
    };
  });

  // ─── Add Data Rows with Alternating Colors ─────────────────────
  rows.forEach((rowData, index) => {
    const row = worksheet.addRow(rowData);
    row.height = 18;

    const isAltRow = index % 2 !== 0;
    const bgColor = isAltRow ? ROW_ALT_BG_COLOR : ROW_BG_COLOR;

    row.eachCell({ includeEmpty: true }, (cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: bgColor },
      };
      cell.font = {
        size: 11,
        name: 'Calibri',
      };
      cell.alignment = {
        vertical: 'middle',
        wrapText: false,
      };
      cell.border = {
        bottom: { style: 'hair', color: { argb: BORDER_COLOR } },
      };
    });
  });

  // ─── Auto-filter on Header Row ─────────────────────────────────
  if (columns.length > 0) {
    worksheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: 1, column: columns.length },
    };
  }

  // ─── Freeze the Header Row ─────────────────────────────────────
  worksheet.views = [{ state: 'frozen', ySplit: 1 }];

  // ─── Return as Buffer ──────────────────────────────────────────
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};

/**
 * Set response headers for Excel file download
 * @param {Object} res - Express response object
 * @param {string} filename - Download filename (without extension)
 */
const setExcelHeaders = (res, filename) => {
  const timestamp = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${filename}_${timestamp}.xlsx"`
  );
};

module.exports = { createExcelWorkbook, setExcelHeaders };
