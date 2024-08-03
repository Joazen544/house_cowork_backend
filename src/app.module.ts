import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './resources/users/users.module';
import { TasksModule } from './resources/tasks/tasks.module';
import { APP_PIPE } from '@nestjs/core';
import { dataSourceOptions } from './db/data-source';
import { DataSource } from 'typeorm';
import { HousesModule } from './houses/houses.module';
const cookieSession = require('cookie-session');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => {
        return dataSourceOptions;
      },

      dataSourceFactory: async (options) => {
        if (!options) {
          throw new Error('Data source does not exist');
        }
        const dataSource = await new DataSource(options).initialize();
        return dataSource;
      },
    }),

    UsersModule,
    TasksModule,
    HousesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ whitelist: true }),
    },
  ],
})
export class AppModule {
  constructor(private configService: ConfigService) {}
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieSession({ keys: [this.configService.get('COOKIE_KEY')] })).forRoutes('*');
  }
}
