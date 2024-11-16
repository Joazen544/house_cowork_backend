import { Injectable } from '@nestjs/common';
import { JoinRequest, JoinRequestStatus } from '../entities/join-request.entity';
import { User } from '../../users/entities/user.entity';
import { HousesService } from './houses.service';
import { House } from '../entities/house.entity';
import { AnswerJoinRequestResult } from '../dto/request/answer-join-request.dto';
import { JoinRequestsRepository } from '../repositories/join-requests.repository';
import { JoinRequestExistedException } from 'src/common/exceptions/houses/join-request-existed.exception';
import { MemberAlreadyExistsException } from 'src/common/exceptions/houses/member-already-exists.exception';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class JoinRequestsService {
  constructor(
    private readonly joinRequestsRepository: JoinRequestsRepository,
    private readonly housesService: HousesService,
  ) {}

  async createJoinRequest(house: House, user: User) {
    const isUserMemberOfHouse = await this.housesService.isUserMemberOfHouse(user, house);
    if (isUserMemberOfHouse) {
      throw new MemberAlreadyExistsException();
    }
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

  async findOneById(joinRequestId: number) {
    return await this.joinRequestsRepository.findOneBy({ id: joinRequestId });
  }

  @Transactional()
  async answerJoinRequest(joinRequest: JoinRequest, result: string) {
    if (result === AnswerJoinRequestResult.ACCEPT) {
      joinRequest.status = JoinRequestStatus.ACCEPTED;
    } else if (result === AnswerJoinRequestResult.REJECT) {
      joinRequest.status = JoinRequestStatus.REJECTED;
    } else {
      throw new Error('Invalid result');
    }

    await this.joinRequestsRepository.save(joinRequest);

    await this.housesService.addMemberToHouse(joinRequest.user, joinRequest.house);

    // TODO: should send fcm to user

    return true;
  }
}
