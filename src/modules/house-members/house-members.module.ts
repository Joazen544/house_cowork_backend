import { Module } from '@nestjs/common';
import { HouseMembersService } from './house-members.service';

@Module({
  controllers: [],
  providers: [HouseMembersService],
  exports: [HouseMembersService],
})
export class HouseMembersModule {}
