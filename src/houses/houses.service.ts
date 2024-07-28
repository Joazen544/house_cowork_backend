import { Injectable } from '@nestjs/common';
import { CreateHouseDto } from './dto/request/create-house.dto';
import { UpdateHouseDto } from './dto/request/update-house.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class HousesService {
  create(createHouseDto: CreateHouseDto) {
    return 'This action adds a new house';
  }

  findAll() {
    return `This action returns all houses`;
  }

  findOne(id: number) {
    return `This action returns a #${id} house`;
  }

  update(id: number, updateHouseDto: UpdateHouseDto) {
    return `This action updates a #${id} house`;
  }

  remove(id: number) {
    return `This action removes a #${id} house`;
  }

  findOneWithInvitation(invitationCode: string) {
    return `This action looks for invitation first and if invitation not expired, will return house info`;
  }

  createJoinRequest(invitationCode: string) {
    return 'This action create a join request.';
  }

  leave(user: User) {
    return 'This action will make user leave a house.';
  }
}
