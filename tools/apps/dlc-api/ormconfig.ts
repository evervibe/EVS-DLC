import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables
config({ path: join(__dirname, '../.env') });

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_GAME_HOST || 'localhost',
  port: parseInt(process.env.DB_GAME_PORT || '3306', 10),
  username: process.env.DB_GAME_USER || 'root',
  password: process.env.DB_GAME_PASS || 'root',
  database: process.env.DB_GAME_NAME || 'db_game',
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migrations/**/*.js'],
  synchronize: false,
  migrationsRun: false,
  logging: true,
});
