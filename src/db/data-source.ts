import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const isValidDatabaseType = (type: any): type is 'postgres' | 'sqlite' => {
  const validDatabaseTypes: ('postgres' | 'sqlite')[] = ['postgres', 'sqlite'];
  return validDatabaseTypes.includes(type);
};

const createDataSourceOptions = (): PostgresConnectionOptions | SqliteConnectionOptions => {
  const type = process.env.DATABASE_TYPE;
  if (!isValidDatabaseType(type)) {
    throw new Error(`Invalid DATABASE_TYPE: ${type}`);
  }

  const normalDatabaseProperties = {
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: ['dist/db/migrations/*js'],
    synchronize: false,
    autoLoadEntities: true,
    migration: true,
  };

  if (type === 'postgres') {
    return {
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      database: process.env.DATABASE_NAME,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
      ...normalDatabaseProperties,
    };
  } else {
    return {
      type: 'sqlite',
      database: process.env.DATABASE_NAME || '',
      ...normalDatabaseProperties,
    };
  }
};

export const dataSourceOptions: PostgresConnectionOptions | SqliteConnectionOptions = createDataSourceOptions();

export const AppDataSource = new DataSource(dataSourceOptions);
