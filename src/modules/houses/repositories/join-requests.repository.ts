import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { JoinRequest, JoinRequestStatus } from '../entities/join-request.entity';

@Injectable()
export class JoinRequestsRepository extends BaseRepository<JoinRequest> {
  constructor(
    @InjectRepository(JoinRequest) private readonly joinRequestRepo: Repository<JoinRequest>,
    @InjectDataSource() dataSource: DataSource,
  ) {
    super(JoinRequest, dataSource);
  }

  async fetchPendingRequestsWithHouseName(userId: number) {
    return await this.joinRequestRepo.find({
      where: {
        userId,
        status: JoinRequestStatus.PENDING,
      },
      relations: {
        house: true,
      },
      select: {
        house: {
          name: true,
        },
      },
    });
  }

  async fetchHousePendingRequestsWithUserInfo(houseId: number) {
    return await this.joinRequestRepo.find({
      where: {
        houseId,
        status: JoinRequestStatus.PENDING,
      },
      relations: {
        user: true,
      },
    });
  }
}
