import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';
import { HouseMembersModule } from 'src/modules/houses/modules/house-members/house-members.module';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), HouseMembersModule, FilesModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
