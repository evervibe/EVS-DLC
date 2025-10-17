import { DataSource } from 'typeorm';

export async function checkDatabaseConnection(ds: DataSource, name: string): Promise<void> {
  try {
    await ds.query('SELECT 1');
    console.log(`✓ Database connection successful: ${name}`);
  } catch (err) {
    console.error(`❌ Database connection failed: ${name}`);
    console.error(err.message);
    throw err;
  }
}
