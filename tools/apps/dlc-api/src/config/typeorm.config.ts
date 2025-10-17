import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_DATA_HOST || 'localhost',
  port: parseInt(process.env.DB_DATA_PORT || '3306', 10),
  username: process.env.DB_DATA_USER || 'root',
  password: process.env.DB_DATA_PASSWORD || '',
  database: process.env.DB_DATA_NAME || 'db_data',
  synchronize: false,
  migrations: ['dist/migrations/*.js'],
  entities: ['dist/modules/data/**/*.entity.js'],
});
