import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHouseDto } from './dto/request/create-house.dto';
import { UpdateHouseDto } from './dto/request/update-house.dto';
import { User } from '../users/entities/user.entity';
import { House } from './entities/house.entity';
import { DataSource, FindOptionsWhere, MoreThan } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { HousesRepository } from './repositories/houses.repository';
import { RulesRepository } from './repositories/rules.repository';
import { Rule } from './entities/rule.entity';
import { InvitationsRepository } from './repositories/invitations.repository';

@Injectable()
export class HousesService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly housesRepository: HousesRepository,
    private readonly rulesRepository: RulesRepository,
    private readonly invitationsRepository: InvitationsRepository,
  ) {}

  async create(user: User, createHouseDto: CreateHouseDto) {
    const savedHouse = await this.dataSource.transaction(async (transactionalEntityManager) => {
      const house = this.createHouseEntity(createHouseDto);
      const savedHouse = await this.housesRepository.createHouseWithTransaction(
        transactionalEntityManager,
        user,
        house,
        createHouseDto.rules,
      );
      return savedHouse;
    });
    const wholeHouse = await this.findOne({ id: savedHouse.id });

    if (!wholeHouse) {
      throw new NotFoundException('House not created');
    }
    return wholeHouse;
  }

  private createHouseEntity(createHouseDto: CreateHouseDto): House {
    const house = new House();
    house.name = createHouseDto.name;
    house.description = createHouseDto.description;
    return house;
  }

  findHousesByUser(user: User) {
    return this.housesRepository.findHousesByUser(user);
  }

  findOne(attrs: FindOptionsWhere<House>) {
    if (Object.values(attrs).length === 0) {
      return null;
    }
    return this.housesRepository.findOneBy(attrs);
  }

  async update(house: House, updateHouseDto: UpdateHouseDto) {
    return this.dataSource.transaction(async (transactionalEntityManager) => {
      const { name, description, rules } = updateHouseDto;

      Object.assign(house, {
        ...(name && { name }),
        ...(description && { description }),
      });

      const rulesToDelete = await this.rulesRepository.findBy({ house });
      if (rulesToDelete.length > 0) {
        await transactionalEntityManager.delete(Rule, rulesToDelete);
      }
      if (rules && rules.length > 0) {
        const newRules = rules.map((rule) => {
          const ruleEntity = new Rule();
          ruleEntity.description = rule;
          return ruleEntity;
        });
        console.log(newRules);
        house.rules = newRules;
      }

      return transactionalEntityManager.save(house);
    });
  }

  // remove(id: number) {
  //   return `This action removes a #${id} house`;
  // }

  async createInvitation(house: House) {
    const expirationTime = new Date(Date.now() + 5 * 60 * 1000);

    const invitation = await this.invitationsRepository.create({
      invitationCode: this.generateInvitationCode(),
      house,
      expiresAt: expirationTime,
    });
    return invitation;
  }

  async findOneWithInvitation(invitationCode: string) {
    const invitation = await this.invitationsRepository.findOneBy({
      invitationCode,
      expiresAt: MoreThan(new Date()),
    });
    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    return invitation.house;
  }

  // leave(user: User) {
  //   return 'This action will make user leave a house.';
  // }

  async isUserMemberOfHouse(user: User, house: House) {
    const users = await this.getHouseMembers(house);
    return users.some((u) => u.id === user.id);
  }

  async getHouseMembers(house: House) {
    const houseMembers = await this.housesRepository.getHouseMembers(house);

    return houseMembers;
  }

  formatHouseInfoInResponse(house: House) {
    const houseMembers = house.houseMembers;
    const memberIds = houseMembers.map((houseMember) => houseMember.member.id);
    const rules = house.rules.map((rule) => rule.description);
    return { ...house, memberIds, rules };
  }

  private generateInvitationCode(): string {
    return uuidv4();
  }
}
