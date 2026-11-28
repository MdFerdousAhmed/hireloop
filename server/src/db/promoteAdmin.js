// server/src/db/promoteAdmin.js
// Usage: node src/db/promoteAdmin.js user@example.com
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const { pool } = require('./index');

const email = process.argv[2];
if (!email) {
  console.error('Usage: node src/db/promoteAdmin.js <email>');
  process.exit(1);
}

(async () => {
  try {
    const res = await pool.query(
      "UPDATE users SET role = 'ADMIN' WHERE LOWER(email) = LOWER($1) RETURNING id, name, email, role",
      [email.trim()]
    );
    if (res.rows.length === 0) {
      console.error(`No user found with email: ${email}`);
      process.exit(1);
    }
    console.log('User promoted to ADMIN:', res.rows[0]);
  } catch (err) {
    console.error('Failed to promote user:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
})();
