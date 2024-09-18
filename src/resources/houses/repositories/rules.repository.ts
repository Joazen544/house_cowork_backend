import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Rule } from '../entities/rule.entity';
import { House } from '../entities/house.entity';

@Injectable()
export class RulesRepository {
  constructor(@InjectRepository(Rule) private readonly ruleRepo: Repository<Rule>) {}

  createOne(rule: Rule, house: House) {
    rule.house = house;
    return this.saveOne(rule);
  }

  createMany(rules: Rule[], house: House) {
    rules.forEach((rule) => {
      rule.house = house;
    });
    return this.saveMany(rules);
  }

  async saveOne(rule: Rule) {
    return await this.ruleRepo.save(rule);
  }

  async saveMany(rules: Rule[]) {
    return await this.ruleRepo.save(rules);
  }

  findOne(attrs: FindOptionsWhere<Rule>) {
    return this.ruleRepo.findOneBy(attrs);
  }

  find(attrs: FindOptionsWhere<Rule>) {
    return this.ruleRepo.findBy(attrs);
  }

  deleteByHouse(house: House) {
    return this.ruleRepo.delete({ house });
  }
}
