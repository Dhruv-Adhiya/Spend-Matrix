const pool = require('../config/db');
const { validationResult } = require('express-validator');

// Create Transaction
exports.createTransaction = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        data: errors.array()
      });
    }

    const { category_id, type, amount, description, transaction_date } = req.body;
    const userId = req.user.id;

    // Step 1: Verify category ownership
    const categoryCheck = await pool.query(
      'SELECT type FROM categories WHERE id = $1 AND user_id = $2',
      [category_id, userId]
    );

    if (categoryCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
        data: null
      });
    }

    // Step 2: Enforce type consistency
    if (categoryCheck.rows[0].type !== type) {
      return res.status(400).json({
        success: false,
        message: `Category type mismatch. Expected ${categoryCheck.rows[0].type}`,
        data: null
      });
    }

    // Step 3: Insert transaction
    const result = await pool.query(
      'INSERT INTO transactions (user_id, category_id, type, amount, description, transaction_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [userId, category_id, type, amount, description || null, transaction_date]
    );

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

// Get Transactions with Cursor Pagination
exports.getTransactions = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        data: errors.array()
      });
    }

    const userId = req.user.id;
    const {
      limit = 10,
      cursor_date,
      cursor_id,
      type,
      category_id,
      start_date,
      end_date,
      sort = 'desc'
    } = req.query;

    if ((cursor_date && !cursor_id) || (!cursor_date && cursor_id)) {
      return res.status(400).json({
        success: false,
        message: 'Both cursor_date and cursor_id are required for pagination',
        data: null
      });
    }

    if (start_date && end_date && new Date(start_date) > new Date(end_date)) {
      return res.status(400).json({
        success: false,
        message: 'start_date cannot be after end_date',
        data: null
      });
    }

    if (category_id) {
      const categoryCheck = await pool.query(
        'SELECT id FROM categories WHERE id = $1 AND user_id = $2',
        [category_id, userId]
      );

      if (categoryCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Category not found',
          data: null
        });
      }
    }

    const parsedLimit = Math.min(parseInt(limit) || 10, 50);

    let query = 'SELECT * FROM transactions WHERE user_id = $1';
    const params = [userId];
    let paramCount = 2;

    if (type) {
      query += ` AND type = $${paramCount}`;
      params.push(type);
      paramCount++;
    }

    if (category_id) {
      query += ` AND category_id = $${paramCount}`;
      params.push(category_id);
      paramCount++;
    }

    if (start_date) {
      query += ` AND transaction_date >= $${paramCount}`;
      params.push(start_date);
      paramCount++;
    }

    if (end_date) {
      query += ` AND transaction_date <= $${paramCount}`;
      params.push(end_date);
      paramCount++;
    }

    if (cursor_date && cursor_id) {
      if (sort === 'asc') {
        query += ` AND (transaction_date > $${paramCount} OR (transaction_date = $${paramCount} AND id > $${paramCount + 1}))`;
      } else {
        query += ` AND (transaction_date < $${paramCount} OR (transaction_date = $${paramCount} AND id < $${paramCount + 1}))`;
      }
      params.push(cursor_date, cursor_id);
      paramCount += 2;
    }

    const orderDirection = sort === 'asc' ? 'ASC' : 'DESC';
    query += ` ORDER BY transaction_date ${orderDirection}, id ${orderDirection} LIMIT $${paramCount}`;
    params.push(parsedLimit);

    const result = await pool.query(query, params);

    const hasMore = result.rows.length === parsedLimit;
    const nextCursor = hasMore && result.rows.length > 0
      ? {
          cursor_date: result.rows[result.rows.length - 1].transaction_date,
          cursor_id: result.rows[result.rows.length - 1].id
        }
      : null;

    res.status(200).json({
      success: true,
      message: 'Transactions fetched',
      data: {
        transactions: result.rows,
        nextCursor,
        hasMore
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update Transaction
exports.updateTransaction = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        data: errors.array()
      });
    }

    const transactionId = req.params.id;
    const userId = req.user.id;
    const { category_id, type, amount, description, transaction_date } = req.body;

    // Ownership check
    const transactionCheck = await pool.query(
      'SELECT * FROM transactions WHERE id = $1 AND user_id = $2',
      [transactionId, userId]
    );

    if (transactionCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
        data: null
      });
    }

    const existingTransaction = transactionCheck.rows[0];

    // If category is changing, verify ownership and type consistency
    if (category_id && category_id !== existingTransaction.category_id) {
      const categoryCheck = await pool.query(
        'SELECT type FROM categories WHERE id = $1 AND user_id = $2',
        [category_id, userId]
      );

      if (categoryCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Category not found',
          data: null
        });
      }

      const newType = type || existingTransaction.type;
      if (categoryCheck.rows[0].type !== newType) {
        return res.status(400).json({
          success: false,
          message: `Category type mismatch. Expected ${categoryCheck.rows[0].type}`,
          data: null
        });
      }
    }

    // If type is changing but category is not, verify consistency
    if (type && type !== existingTransaction.type && !category_id) {
      const categoryCheck = await pool.query(
        'SELECT type FROM categories WHERE id = $1',
        [existingTransaction.category_id]
      );

      if (categoryCheck.rows.length > 0 && categoryCheck.rows[0].type !== type) {
        return res.status(400).json({
          success: false,
          message: `Cannot change type. Category expects ${categoryCheck.rows[0].type}`,
          data: null
        });
      }
    }

    // Build dynamic update
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (category_id !== undefined) {
      updates.push(`category_id = $${paramCount++}`);
      values.push(category_id);
    }

    if (type) {
      updates.push(`type = $${paramCount++}`);
      values.push(type);
    }

    if (amount !== undefined) {
      updates.push(`amount = $${paramCount++}`);
      values.push(amount);
    }

    if (description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      values.push(description);
    }

    if (transaction_date) {
      updates.push(`transaction_date = $${paramCount++}`);
      values.push(transaction_date);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update',
        data: null
      });
    }

    values.push(transactionId, userId);

    const result = await pool.query(
      `UPDATE transactions SET ${updates.join(', ')} WHERE id = $${paramCount++} AND user_id = $${paramCount++} RETURNING *`,
      values
    );

    res.status(200).json({
      success: true,
      message: 'Transaction updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

// Delete Transaction
exports.deleteTransaction = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        data: errors.array()
      });
    }

    const transactionId = req.params.id;
    const userId = req.user.id;

    const result = await pool.query(
      'DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING *',
      [transactionId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
        data: null
      });
    }

    res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully',
      data: null
    });
  } catch (error) {
    next(error);
  }
};
