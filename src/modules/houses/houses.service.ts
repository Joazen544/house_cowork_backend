import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateHouseDto } from './dto/request/create-house.dto';
import { UpdateHouseDto } from './dto/request/update-house.dto';
import { User } from '../users/entities/user.entity';
import { House } from './entities/house.entity';
import { FindOptionsWhere, MoreThan } from 'typeorm';
import { HousesRepository } from './repositories/houses.repository';
import { RulesRepository } from './repositories/rules.repository';
import { Rule } from './entities/rule.entity';
import { InvitationsRepository } from './repositories/invitations.repository';
import { IsolationLevel, Transactional } from 'typeorm-transactional';
import { InvitationNotFoundException } from '../../common/exceptions/houses/invitation-not-found.exception';

@Injectable()
export class HousesService {
  constructor(
    private readonly housesRepository: HousesRepository,
    private readonly rulesRepository: RulesRepository,
    private readonly invitationsRepository: InvitationsRepository,
  ) {}

  @Transactional()
  async create(user: User, createHouseDto: CreateHouseDto) {
    const house = this.createHouseEntity(createHouseDto);
    if (createHouseDto.rules && createHouseDto.rules.length > 0) {
      const ruleEntities = createHouseDto.rules.map((ruleContent) => {
        const rule = new Rule();
        rule.description = ruleContent;
        return rule;
      });
      house.rules = ruleEntities;
    }
    const savedHouse = await this.housesRepository.save(house);
    await this.addMemberToHouse(user, savedHouse);

    const wholeHouse = await this.findOne({ id: savedHouse.id });

    if (!wholeHouse) {
      throw new Error('House not created');
    }
    return wholeHouse;
  }

  private async addMemberToHouse(user: User, house: House) {
    const isUserMemberOfHouse = await this.isUserMemberOfHouse(user, house);
    if (!isUserMemberOfHouse) {
      await this.housesRepository.addMemberToHouse(user, house);
    } else {
      throw new BadRequestException('User is already a member of the house');
    }
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

  @Transactional()
  async update(house: House, updateHouseDto: UpdateHouseDto) {
    const { name, description, rules } = updateHouseDto;

    Object.assign(house, {
      ...(name && { name }),
      ...(description && { description }),
    });
    await this.housesRepository.save(house);

    await this.rulesRepository.deleteByHouse(house);
    if (rules && rules.length > 0) {
      const newRules = rules.map((rule) => {
        const ruleEntity = new Rule();
        ruleEntity.description = rule;
        return ruleEntity;
      });
      house.rules = newRules;
    }

    await this.housesRepository.save(house);
    return house;
  }

  // remove(id: number) {
  //   return `This action removes a #${id} house`;
  // }

  @Transactional({ isolationLevel: IsolationLevel.SERIALIZABLE })
  async createInvitation(house: House) {
    const expirationTime = this.calculateExpirationTime(5);
    const invitationCode = await this.generateInvitationCode();

    const invitation = await this.invitationsRepository.create({
      invitationCode,
      house,
      expiresAt: expirationTime,
    });
    return invitation;
  }

  private calculateExpirationTime(minutes: number) {
    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + minutes);
    return expirationTime;
  }

  async findOneWithInvitation(invitationCode: string) {
    const invitation = await this.invitationsRepository.findOneBy({
      invitationCode,
      expiresAt: MoreThan(new Date()),
    });
    if (!invitation) {
      throw new InvitationNotFoundException();
    }

    const house = invitation.house;
    return house;
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
    const memberIds = houseMembers ? houseMembers.map((houseMember) => houseMember.member.id) : [];
    const rules = house.rules ? house.rules.map((rule) => rule.description) : [];
    return { ...house, memberIds, rules };
  }

  private async generateInvitationCode(): Promise<string> {
    let code: string = '';
    let isUnique = false;
    const maxRetries = 10;
    let retries = 0;

    while (!isUnique && retries < maxRetries) {
      code = Math.random().toString(36).substring(2, 8).toUpperCase();
      const existingInvitation = await this.invitationsRepository.findOneBy({
        invitationCode: code,
        expiresAt: MoreThan(new Date()),
      });
      if (!existingInvitation) {
        isUnique = true;
      }
      retries++;
    }
    if (retries >= maxRetries) {
      throw new Error('Failed to generate a unique invitation code');
    }
    return code;
  }
}
