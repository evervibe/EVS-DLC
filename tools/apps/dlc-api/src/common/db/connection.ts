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
  const databases = [
    { name: 'auth', config: env.dbAuth },
    { name: 'game', config: env.dbGame },
    { name: 'data', config: env.dbData },
    { name: 'post', config: env.dbPost },
  ];
  
  for (const { name, config } of databases) {
    try {
      const connection = await dbPools[name as keyof DatabasePools].getConnection();
      console.log(`✓ Database connection successful: ${name} (${config.database})`);
      connection.release();
    } catch (error) {
      console.error(`✗ Database connection failed: ${name}`, error.message);
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
