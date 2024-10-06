import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { JoinRequest } from '../entities/join-request.entity';

@Injectable()
export class JoinRequestsRepository extends BaseRepository<JoinRequest> {
  constructor(
    @InjectRepository(JoinRequest) private readonly joinRequestRepo: Repository<JoinRequest>,
    @InjectDataSource() dataSource: DataSource,
  ) {
    super(JoinRequest, dataSource);
  }
}
