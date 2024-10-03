import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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
import { DATA_SOURCE } from './common/constant';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieSession = require('cookie-session');

const AppDataSource = new DataSource(dataSourceOptions);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async () => {
        if (!AppDataSource.isInitialized) {
          await AppDataSource.initialize();
        }
        return AppDataSource.options;
      },
    }),
    EventEmitterModule.forRoot(),
    AuthModule,
    UsersModule,
    TasksModule,
    HousesModule,
    DeviceTokensModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ whitelist: true }),
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: DATA_SOURCE,
      useValue: AppDataSource,
    },
  ],
})
export class AppModule {
  constructor(private configService: ConfigService) {}
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieSession({ keys: [this.configService.get('COOKIE_KEY')] })).forRoutes('*');
  }
}
