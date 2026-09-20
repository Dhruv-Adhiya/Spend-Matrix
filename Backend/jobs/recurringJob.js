const cron = require('node-cron');
const pool = require('../config/db');
const { processRecurring } = require('../services/recurringProcessor');
const { notifyUpcomingRecurring } = require('../services/notificationService');

// Schedule job to run daily at midnight
const startRecurringJob = () => {
  cron.schedule('0 0 * * *', async () => {
    console.log('Running recurring transactions job via node-cron...');
    try {
      const processed = await processRecurring();
      console.log(`Recurring transactions job completed. Processed ${processed} rules.`);
      
      // Upcoming recurring reminders: rules due tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      
      const { rows: upcomingRules } = await pool.query(
        `SELECT * FROM recurring_transactions
         WHERE next_run_date = $1 AND is_active = TRUE
           AND (end_date IS NULL OR end_date >= $1)`,
        [tomorrowStr]
      );
  
      for (const rule of upcomingRules) {
        notifyUpcomingRecurring(rule.user_id, rule);
      }
    } catch (error) {
      console.error('Error in recurring transactions job:', error.message);
    }
  });
  console.log('Recurring transactions job scheduled (daily at midnight)');
};

module.exports = { startRecurringJob };
