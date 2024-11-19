import { Injectable } from '@nestjs/common';
import { JoinRequest, JoinRequestStatus } from '../entities/join-request.entity';
import { User } from '../../users/entities/user.entity';
import { House } from '../entities/house.entity';
import { AnswerJoinRequestResult } from '../dto/request/answer-join-request.dto';
import { JoinRequestsRepository } from '../repositories/join-requests.repository';
import { JoinRequestExistedException } from 'src/common/exceptions/houses/join-request-existed.exception';
import { MemberAlreadyExistsException } from 'src/common/exceptions/houses/member-already-exists.exception';
import { Transactional } from 'typeorm-transactional';
import { HouseMembersService } from 'src/modules/house-members/house-members.service';
import { AnswerNotPendingJoinRequestException } from 'src/common/exceptions/houses/answer-not-pending-join-request.exception';

@Injectable()
export class JoinRequestsService {
  constructor(
    private readonly joinRequestsRepository: JoinRequestsRepository,
    private readonly houseMembersService: HouseMembersService,
  ) {}

  async createJoinRequest(house: House, user: User) {
    const isUserMemberOfHouse = await this.houseMembersService.isUserMemberOfHouse(user.id, house.id);
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
    return joinRequest;
  }

  formatJoinRequestInResponse(joinRequest: JoinRequest) {
    return {
      id: joinRequest.id,
      status: joinRequest.status,
      houseName: joinRequest.house.name,
    };
  }

  formatJoinRequestsInResponse(joinRequests: JoinRequest[]) {
    const result = joinRequests.map(this.formatJoinRequestInResponse);
    return result;
  }

  async getSentJoinRequests(user: User) {
    return this.joinRequestsRepository.findBy({
      user,
      status: JoinRequestStatus.PENDING,
    });
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
    if (joinRequest.status !== JoinRequestStatus.PENDING) {
      throw new AnswerNotPendingJoinRequestException();
    }
    if (result === AnswerJoinRequestResult.ACCEPT) {
      joinRequest.status = JoinRequestStatus.ACCEPTED;
      await this.houseMembersService.addMemberToHouse(joinRequest.user, joinRequest.house);
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
