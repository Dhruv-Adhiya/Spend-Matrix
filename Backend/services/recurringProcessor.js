const pool = require('../config/db');

const frequencyIntervalMap = {
  daily: '1 day',
  weekly: '7 days',
  monthly: '1 month',
  yearly: '1 year',
};

const processRecurring = async () => {
  const client = await pool.connect();
  let processed = 0;

  try {
    const { rows: rules } = await client.query(
      `SELECT * FROM recurring_transactions
       WHERE next_run_date <= CURRENT_DATE
       AND is_active = TRUE
       AND (end_date IS NULL OR end_date >= CURRENT_DATE)`
    );

    for (const rule of rules) {
      const interval = frequencyIntervalMap[rule.frequency];
      if (!interval) continue;

      await client.query('BEGIN');
      try {
        await client.query(
          `INSERT INTO transactions
           (user_id, category_id, type, amount, description, transaction_date, payment_source)
           VALUES ($1, $2, $3, $4, $5, CURRENT_DATE, $6)`,
          [rule.user_id, rule.category_id, rule.type, rule.amount, rule.description, rule.payment_source]
        );

        await client.query(
          `UPDATE recurring_transactions
           SET last_run_date = CURRENT_DATE,
               next_run_date = CURRENT_DATE + INTERVAL '${interval}'
           WHERE id = $1`,
          [rule.id]
        );

        await client.query('COMMIT');
        processed++;
      } catch {
        await client.query('ROLLBACK');
      }
    }
  } finally {
    client.release();
  }

  return processed;
};

module.exports = { processRecurring };
