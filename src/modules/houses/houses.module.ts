import { Module } from '@nestjs/common';
import { HousesService } from './houses.service';
import { HousesController } from './houses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { House } from './entities/house.entity';
import { Rule } from './entities/rule.entity';
import { Invitation } from './entities/invitation.entity';
import { JoinRequestsService } from './join-requests.service';
import { JoinRequest } from './entities/join-request.entity';
import { HousesRepository } from './repositories/houses.repository';
import { RulesRepository } from './repositories/rules.repository';
import { InvitationsRepository } from './repositories/invitations.repository';
import { HouseMember } from '../house-members/house-member.entity';
import { JoinRequestsRepository } from './repositories/join-requests.repository';
import { HouseMembersModule } from '../house-members/house-members.module';

@Module({
  imports: [TypeOrmModule.forFeature([House, HouseMember, Rule, Invitation, JoinRequest]), HouseMembersModule],
  controllers: [HousesController],
  providers: [
    HousesService,
    JoinRequestsService,
    HousesRepository,
    RulesRepository,
    InvitationsRepository,
    JoinRequestsRepository,
  ],
  exports: [HousesService],
})
export class HousesModule {}
