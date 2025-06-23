import mysql from "mysql2/promise";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const saltRounds = 10;

const db = mysql.createPool({
  host: process.env.DB_HOST!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
});

async function seed() {
  try {
    const pw1 = await bcrypt.hash("password123", saltRounds);
    const pw2 = await bcrypt.hash("repair456", saltRounds);

    await db.query(`
      INSERT INTO users (name, email, password_hash, role) VALUES
      ('Admin User', 'admin@example.com', '${pw1}', 'admin'),
      ('Mechanic Mike', 'mike@example.com', '${pw2}', 'staff');
    `);

    await db.query(`
      INSERT INTO customers (full_name, phone, email, address) VALUES
      ('John Smith', '07700900001', 'john.smith@example.com', '123 Main Street, Essex'),
      ('Sarah Taylor', '07700900002', 'sarah.taylor@example.com', '45 Station Road, Basildon');
    `);

    const [adminRows] = await db.query<any[]>(
      `SELECT id FROM users WHERE email = 'admin@example.com'`
    );
    const [mikeRows] = await db.query<any[]>(
      `SELECT id FROM users WHERE email = 'mike@example.com'`
    );
    const [johnRows] = await db.query<any[]>(
      `SELECT id FROM customers WHERE full_name = 'John Smith'`
    );
    const [sarahRows] = await db.query<any[]>(
      `SELECT id FROM customers WHERE full_name = 'Sarah Taylor'`
    );

    const admin = adminRows[0];
    const mike = mikeRows[0];
    const john = johnRows[0];
    const sarah = sarahRows[0];

    await db.query(`
      INSERT INTO invoices (customer_id, user_id, invoice_number, issue_date, due_date, subtotal, tax, total, notes) VALUES
      ('${john.id}', '${admin.id}', 'INV-0001', '2025-06-01', '2025-06-15', 200.00, 40.00, 240.00, 'Full service and oil change'),
      ('${sarah.id}', '${mike.id}', 'INV-0002', '2025-06-02', '2025-06-16', 150.00, 30.00, 180.00, 'Brake pad replacement');
    `);

    const [inv1Rows] = await db.query<any[]>(
      `SELECT id FROM invoices WHERE invoice_number = 'INV-0001'`
    );
    const [inv2Rows] = await db.query<any[]>(
      `SELECT id FROM invoices WHERE invoice_number = 'INV-0002'`
    );

    const inv1 = inv1Rows[0];
    const inv2 = inv2Rows[0];

    await db.query(`
      INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, total_price) VALUES
      ('${inv1.id}', 'Engine oil change', 1, 50.00, 50.00),
      ('${inv1.id}', 'Labour - 2 hours', 2, 75.00, 150.00),
      ('${inv2.id}', 'Brake pads (front)', 1, 80.00, 80.00),
      ('${inv2.id}', 'Labour - 1 hour', 1, 70.00, 70.00);
    `);

    console.log("✅ Database seeded.");
  } catch (err) {
    console.error("❌ Seeding error:", err);
  } finally {
    db.end();
  }
}

seed();
