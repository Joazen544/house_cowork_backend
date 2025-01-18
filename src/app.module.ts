import { Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { dataSourceOptions } from './db/data-source';
import { DataSource } from 'typeorm';
import { HousesModule } from './modules/houses/houses.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuthGuard } from './common/guards/auth.guard';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DeviceTokensModule } from './modules/device-tokens/device-tokens.module';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { HouseMembersModule } from './modules/houses/modules/house-members/house-members.module';
import { FilesModule } from './modules/files/files.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        return dataSourceOptions;
      },
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error('Invalid options passed to dataSourceFactory');
        }
        return addTransactionalDataSource(new DataSource(options));
      },
    }),
    EventEmitterModule.forRoot(),
    AuthModule,
    UsersModule,
    TasksModule,
    HousesModule,
    DeviceTokensModule,
    HouseMembersModule,
    FilesModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ whitelist: true }),
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
