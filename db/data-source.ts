import { DataSource } from 'typeorm';
import { User } from '../src/users/user.entity';
import { Task } from '../src/tasks/task.entity';
import { ConfigService } from '@nestjs/config';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';

const isValidDatabaseType = (type: any): type is 'postgres' | 'sqlite' => {
  const validDatabaseTypes: ('postgres' | 'sqlite')[] = ['postgres', 'sqlite'];
  return validDatabaseTypes.includes(type);
};

const createDataSourceOptions = (
  configService: ConfigService,
): PostgresConnectionOptions | SqliteConnectionOptions => {
  const type = configService.get<string>('DATABASE_TYPE', 'sqlite');
  if (!isValidDatabaseType(type)) {
    throw new Error(`Invalid DATABASE_TYPE: ${type}`);
  }

  const normarlDatabaseProperties = {
    entities: [User, Task],
    migrations: ['dist/db/migrations/*js'],
    synchronize: false,
  };

  if (type === 'postgres') {
    return {
      type: 'postgres',
      database: configService.get<string>('DATABASE_NAME'),
      username: configService.get<string>('DATABASE_USERNAME'),
      password: configService.get<string>('DATABASE_PASSWORD'),
      ...normarlDatabaseProperties,
    };
  } else {
    return {
      type: 'sqlite',
      database: configService.get<string>('DATABASE_NAME', ''),
      ...normarlDatabaseProperties,
    };
  }
};

const configService = new ConfigService();
export const dataSourceOptions = createDataSourceOptions(configService);
const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
