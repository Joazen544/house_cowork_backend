import { BaseRepository } from 'src/common/repositories/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PushTemplate } from '../entities/push-template.entity';

@Injectable()
export class PushTemplatesRepository extends BaseRepository<PushTemplate> {
  constructor(
    @InjectRepository(PushTemplate) private readonly pushTemplateRepo: Repository<PushTemplate>,
    @InjectDataSource() dataSource: DataSource,
  ) {
    super(PushTemplate, dataSource);
  }

  findOneByKey(key: string) {
    return this.pushTemplateRepo.findOne({
      where: { key },
    });
  }
}
