import { Injectable } from '@nestjs/common';
import { JoinRequestStatus } from './entities/join-request.entity';
import { User } from '../users/entities/user.entity';
import { HousesService } from './houses.service';
import { House } from './entities/house.entity';
import { AnswerJoinRequestResult } from './dto/request/answer-join-request.dto';
import { JoinRequestsRepository } from './repositories/join-requests.repository';
import { JoinRequestExistedException } from 'src/common/exceptions/houses/join-request-existed.exception';
import { JoinRequestNotFoundException } from 'src/common/exceptions/houses/join-request-not-found.exception';

@Injectable()
export class JoinRequestsService {
  constructor(
    private readonly joinRequestsRepository: JoinRequestsRepository,
    private readonly housesService: HousesService,
  ) {}

  async createJoinRequest(invitationCode: string, user: User) {
    const house = await this.housesService.findOneWithInvitation(invitationCode);
    const existingRequest = await this.joinRequestsRepository.findOneBy({
      house,
      user,
      status: JoinRequestStatus.PENDING,
    });

    if (existingRequest) {
      throw new JoinRequestExistedException();
    }

    const joinRequest = await this.joinRequestsRepository.create({
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
    return this.joinRequestsRepository.findBy({
      house,
      status: JoinRequestStatus.PENDING,
    });
  }

  getJoinRequest(joinRequestId: number) {
    return this.joinRequestsRepository.findOneBy({ id: joinRequestId });
  }

  async answerJoinRequest(joinRequestId: number, result: string) {
    const joinRequest = await this.getJoinRequest(joinRequestId);
    if (!joinRequest) {
      throw new JoinRequestNotFoundException();
    }

    if (result === AnswerJoinRequestResult.ACCEPT) {
      joinRequest.status = JoinRequestStatus.ACCEPTED;
    } else if (result === AnswerJoinRequestResult.REJECT) {
      joinRequest.status = JoinRequestStatus.REJECTED;
    } else {
      throw new Error('Invalid result');
    }

    await this.joinRequestsRepository.save(joinRequest);

    // TODO: should send fcm to user

    return true;
  }
}
