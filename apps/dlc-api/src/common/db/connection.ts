import * as mysql from 'mysql2/promise';
import { env, DatabaseConfig } from '../../config/env';

export interface DatabasePools {
  auth: mysql.Pool;
  game: mysql.Pool;
  data: mysql.Pool;
  post: mysql.Pool;
}

function createPool(config: DatabaseConfig): mysql.Pool {
  return mysql.createPool({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
}

export const dbPools: DatabasePools = {
  auth: createPool(env.dbAuth),
  game: createPool(env.dbGame),
  data: createPool(env.dbData),
  post: createPool(env.dbPost),
};

export async function testDbConnections(): Promise<void> {
  const databases = ['auth', 'game', 'data', 'post'] as const;
  
  for (const db of databases) {
    try {
      const connection = await dbPools[db].getConnection();
      console.log(`✓ Database connection successful: ${db} (${env[`db${db.charAt(0).toUpperCase() + db.slice(1)}` as keyof typeof env]['database']})`);
      connection.release();
    } catch (error) {
      console.error(`✗ Database connection failed: ${db}`, error.message);
      throw error;
    }
  }
}

export async function closeDatabaseConnections(): Promise<void> {
  await Promise.all([
    dbPools.auth.end(),
    dbPools.game.end(),
    dbPools.data.end(),
    dbPools.post.end(),
  ]);
  console.log('All database connections closed');
}
