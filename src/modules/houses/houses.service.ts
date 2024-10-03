import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHouseDto } from './dto/request/create-house.dto';
import { UpdateHouseDto } from './dto/request/update-house.dto';
import { User } from '../users/entities/user.entity';
import { House } from './entities/house.entity';
import { FindOptionsWhere, MoreThan, QueryRunner } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { HousesRepository } from './repositories/houses.repository';
import { RulesRepository } from './repositories/rules.repository';
import { Rule } from './entities/rule.entity';
import { InvitationsRepository } from './repositories/invitations.repository';
import { HouseMember } from './entities/house-member.entity';

@Injectable()
export class HousesService {
  constructor(
    private readonly housesRepository: HousesRepository,
    private readonly rulesRepository: RulesRepository,
    private readonly invitationsRepository: InvitationsRepository,
  ) {}

  async create(user: User, createHouseDto: CreateHouseDto) {
    const queryRunner = this.housesRepository.getQueryRunner();
    await queryRunner.startTransaction();

    try {
      const house = this.createHouseEntity(createHouseDto);
      const savedHouse = await queryRunner.manager.save(house);

      await this.addUserToHouse(queryRunner, user, savedHouse);

      if (createHouseDto.rules && createHouseDto.rules.length > 0) {
        await this.addRulesToHouse(queryRunner, createHouseDto.rules, savedHouse);
      }

      await queryRunner.commitTransaction();
      return savedHouse;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(`Failed to create house: ${(error as Error).message}`);
    } finally {
      await queryRunner.release();
    }
  }

  private createHouseEntity(createHouseDto: CreateHouseDto): House {
    const house = new House();
    house.name = createHouseDto.name;
    house.description = createHouseDto.description;
    return house;
  }

  private async addUserToHouse(queryRunner: QueryRunner, user: User, house: House) {
    const houseMember = new HouseMember();
    houseMember.member = user;
    houseMember.house = house;
    await queryRunner.manager.save(houseMember);
  }

  private async addRulesToHouse(queryRunner: QueryRunner, rules: string[], house: House) {
    const ruleEntities = rules.map((ruleContent) => {
      const rule = new Rule();
      rule.description = ruleContent;
      rule.house = house;
      return rule;
    });
    await queryRunner.manager.save(ruleEntities);
  }

  findHousesByUser(user: User) {
    return this.housesRepository.findHousesByUser(user);
  }

  findOne(attrs: FindOptionsWhere<House>) {
    if (Object.values(attrs).length === 0) {
      return null;
    }
    return this.housesRepository.findOne({ where: attrs });
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

    return this.housesRepository.save(house);
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
    const invitation = await this.invitationsRepository.findOne({
      where: {
        invitationCode: invitationCode,
        expiresAt: MoreThan(new Date()),
      },
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

    console.log(houseMembers);
    return houseMembers;
  }

  private generateInvitationCode(): string {
    return uuidv4();
  }
}
