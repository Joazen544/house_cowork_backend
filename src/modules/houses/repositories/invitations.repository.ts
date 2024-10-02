import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { House } from '../entities/house.entity';
import { Invitation } from '../entities/invitation.entity';

@Injectable()
export class InvitationsRepository {
  constructor(@InjectRepository(Invitation) private readonly invitationRepo: Repository<Invitation>) {}

  create(invitationCode: string, house: House, expiresAt: Date) {
    const newInvitation = this.invitationRepo.create({ invitationCode, house, expiresAt });
    return this.saveOne(newInvitation);
  }

  async saveOne(invitation: Invitation) {
    return await this.invitationRepo.save(invitation);
  }

  findOne(attrs: FindOptionsWhere<Invitation>) {
    return this.invitationRepo.findOneBy(attrs);
  }

  findMany(attrs: FindOptionsWhere<Invitation>) {
    return this.invitationRepo.findBy(attrs);
  }
}
