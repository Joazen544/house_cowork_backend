import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Task } from '../tasks/entities/task.entity';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';
import { House } from 'src/houses/entities/house.entity';
import { Rule } from 'src/houses/entities/rule.entity';
import { JoinRequest } from 'src/houses/entities/join-request.entity';

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const isValidDatabaseType = (type: any): type is 'postgres' | 'sqlite' => {
  const validDatabaseTypes: ('postgres' | 'sqlite')[] = ['postgres', 'sqlite'];
  return validDatabaseTypes.includes(type);
};

export const createDataSourceOptions = (): PostgresConnectionOptions | SqliteConnectionOptions => {
  const type = process.env.DATABASE_TYPE;
  if (!isValidDatabaseType(type)) {
    throw new Error(`Invalid DATABASE_TYPE: ${type}`);
  }

  const normarlDatabaseProperties = {
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: ['dist/db/migrations/*js'],
    synchronize: true,
    migration: true,
  };

  if (type === 'postgres') {
    console.log('type is postgres');
    return {
      type: 'postgres',
      database: process.env.DATABASE_NAME,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      ...normarlDatabaseProperties,
    };
  } else {
    console.log('type is sqlite');
    return {
      type: 'sqlite',
      database: process.env.DATABASE_NAME || '',
      ...normarlDatabaseProperties,
    };
  }
};

export const dataSourceOptions: PostgresConnectionOptions | SqliteConnectionOptions = createDataSourceOptions();

const AppDataSource = new DataSource(dataSourceOptions);

export default AppDataSource;
