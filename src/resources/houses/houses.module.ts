import { Module } from '@nestjs/common';
import { HousesService } from './houses.service';
import { HousesController } from './houses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { House } from './entities/house.entity';
import { UsersModule } from 'src/resources/users/users.module';
import { Rule } from './entities/rule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([House, Rule]), UsersModule],
  controllers: [HousesController],
  providers: [HousesService],
  exports: [HousesService],
})
export class HousesModule {}
