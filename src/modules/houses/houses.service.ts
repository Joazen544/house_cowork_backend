import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHouseDto } from './dto/request/create-house.dto';
import { UpdateHouseDto } from './dto/request/update-house.dto';
import { User } from 'src/modules/users/entities/user.entity';
import { House } from './entities/house.entity';
import { FindOptionsWhere, MoreThan } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { HousesRepository } from './repositories/houses.repository';
import { RulesRepository } from './repositories/rules.repository';
import { Rule } from './entities/rule.entity';
import { InvitationsRepository } from './repositories/invitations.repository';

@Injectable()
export class HousesService {
  constructor(
    private readonly housesRepository: HousesRepository,
    private readonly rulesRepository: RulesRepository,
    private readonly invitationsRepository: InvitationsRepository,
  ) {}

  async create(user: User, createHouseDto: CreateHouseDto) {
    const house = new House();

    house.users.push(user);
    house.name = createHouseDto.name;
    house.description = createHouseDto.description;

    const savedHouse = await this.housesRepository.create(house);
    const rules = createHouseDto.rules.map((ruleContent) => {
      const rule = new Rule();
      rule.description = ruleContent;
      return rule;
    });

    await this.rulesRepository.createMany(rules, savedHouse);

    return savedHouse;
  }

  findOne(attrs: FindOptionsWhere<User>) {
    if (Object.values(attrs).length === 0) {
      return null;
    }
    return this.housesRepository.findOne(attrs);
  }

  async update(house: House, updateHouseDto: UpdateHouseDto) {
    const { name, description, rules } = updateHouseDto;

    Object.assign(house, {
      ...(name && { name }),
      ...(description && { description }),
    });

    if (rules && rules.length > 0) {
      await this.rulesRepository.deleteByHouse(house);

      const newRules = rules.map((rule) => {
        const ruleEntity = new Rule();
        ruleEntity.description = rule;
        return ruleEntity;
      });

      await this.rulesRepository.createMany(newRules, house);
    }

    return this.housesRepository.saveOne(house);
  }

  // remove(id: number) {
  //   return `This action removes a #${id} house`;
  // }

  async createInvitation(house: House) {
    const expirationTime = new Date(Date.now() + 5 * 60 * 1000);

    const invitation = await this.invitationsRepository.create(this.generateInvitationCode(), house, expirationTime);
    return invitation;
  }

  async findOneWithInvitation(invitationCode: string) {
    const invitation = await this.invitationsRepository.findOne({
      invitation_code: invitationCode,
      expires_at: MoreThan(new Date()),
    });
    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    return invitation.house;
  }

  // leave(user: User) {
  //   return 'This action will make user leave a house.';
  // }

  isUserMemberOfHouse(user: User, house: House) {
    return house.users.some((u) => u.id === user.id);
  }

  private generateInvitationCode(): string {
    return uuidv4();
  }
}
