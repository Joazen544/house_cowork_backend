import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Invitation } from '../entities/invitation.entity';
import { BaseRepository } from 'src/common/repositories/base.repository';

@Injectable()
export class InvitationsRepository extends BaseRepository<Invitation> {
  constructor(
    @InjectRepository(Invitation) private readonly invitationRepo: Repository<Invitation>,
    @InjectDataSource() dataSource: DataSource,
  ) {
    super(Invitation, dataSource);
  }
}
