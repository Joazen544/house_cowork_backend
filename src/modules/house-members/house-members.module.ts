import { Module } from '@nestjs/common';
import { HouseMembersService } from './house-members.service';
import { HouseMembersRepository } from './house-members.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HouseMember } from './house-member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HouseMember])],
  providers: [HouseMembersService, HouseMembersRepository],
  exports: [HouseMembersService],
})
export class HouseMembersModule {}
