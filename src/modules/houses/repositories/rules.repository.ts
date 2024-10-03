import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Rule } from '../entities/rule.entity';
import { House } from '../entities/house.entity';
import { BaseRepository } from 'src/common/repositories/base.repository';

@Injectable()
export class RulesRepository extends BaseRepository<Rule> {
  constructor(
    @InjectRepository(Rule) private readonly ruleRepo: Repository<Rule>,
    @InjectDataSource() dataSource: DataSource,
  ) {
    super(Rule, dataSource);
  }

  createMany(rules: Rule[], house: House) {
    rules.forEach((rule) => {
      rule.house = house;
    });
    return this.saveMany(rules);
  }

  deleteByHouse(house: House) {
    return this.ruleRepo.delete({ house });
  }
}
