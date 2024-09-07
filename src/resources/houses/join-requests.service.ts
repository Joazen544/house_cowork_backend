import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JoinRequest, JoinRequestStatus } from './entities/join-request.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { HousesService } from './houses.service';
import { House } from './entities/house.entity';
import { AnswerJoinRequestResult } from './dto/request/answer-join-request.dto';

@Injectable()
export class JoinRequestsService {
  constructor(
    @InjectRepository(JoinRequest) private joinRequestRepo: Repository<JoinRequest>,
    private readonly housesService: HousesService,
  ) {}

  async createJoinRequest(invitationCode: string, user: User) {
    const house = await this.housesService.findOneWithInvitation(invitationCode);
    const joinRequest = this.joinRequestRepo.create({
      house,
      user,
    });

    // TODO: send fcm to house members
    if (joinRequest) {
      return true;
    }
    return false;
  }

  async getPendingJoinRequests(house: House) {
    return this.joinRequestRepo.find({
      where: {
        house: house,
        status: JoinRequestStatus.PENDING,
      },
    });
  }

  getJoinRequest(joinRequestId: number) {
    return this.joinRequestRepo.findOne({ where: { id: joinRequestId } });
  }

  async answerJoinRequest(joinRequestId: number, result: string) {
    const joinRequest = await this.getJoinRequest(joinRequestId);
    if (!joinRequest) {
      throw new NotFoundException('Join request not found');
    }

    if (result === AnswerJoinRequestResult.ACCEPT) {
      joinRequest.status = JoinRequestStatus.ACCEPTED;
    } else if (result === AnswerJoinRequestResult.REJECT) {
      joinRequest.status = JoinRequestStatus.REJECTED;
    } else {
      throw new BadRequestException('Invalid result');
    }

    await this.joinRequestRepo.save(joinRequest);

    // should send fcm to user

    return true;
  }
}
