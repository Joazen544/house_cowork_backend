import { Injectable } from '@nestjs/common';
import { CreateHouseDto } from './dto/request/create-house.dto';
import { UpdateHouseDto } from './dto/request/update-house.dto';
import { User } from 'src/resources/users/entities/user.entity';
import { House } from './entities/house.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Rule } from './entities/rule.entity';

@Injectable()
export class HousesService {
  constructor(
    @InjectRepository(House) private houseRepo: Repository<House>,
    @InjectRepository(Rule) private ruleRepo: Repository<Rule>,
  ) {}

  async create(user: User, createHouseDto: CreateHouseDto) {
    const house = this.houseRepo.create({
      name: createHouseDto.name,
      description: createHouseDto.description,
      users: [user],
    });

    const savedHouse = await this.houseRepo.save(house);

    await Promise.all(
      createHouseDto.rules.map((ruleContent) =>
        this.ruleRepo.save(this.ruleRepo.create({ description: ruleContent, house: savedHouse })),
      ),
    );
    return savedHouse;
  }

  findAll() {
    return `This action returns all houses`;
  }

  findOne(attrs: FindOptionsWhere<User>) {
    if (Object.values(attrs).length === 0) {
      return null;
    }
    return this.houseRepo.findOneBy(attrs);
  }

  update(id: number, updateHouseDto: UpdateHouseDto) {
    return `This action updates a #${id} house`;
  }

  remove(id: number) {
    return `This action removes a #${id} house`;
  }

  createInvitation(user: User, createHouseDto: CreateHouseDto) {}

  findOneWithInvitation(invitationCode: string) {
    return `This action looks for invitation first and if invitation not expired, will return house info`;
  }

  createJoinRequest(invitationCode: string) {
    return 'This action create a join request.';
  }

  leave(user: User) {
    return 'This action will make user leave a house.';
  }

  isUserMemberOfHouse(user: User, house: House) {
    return 'This action return if user member of a house.';
  }
}
