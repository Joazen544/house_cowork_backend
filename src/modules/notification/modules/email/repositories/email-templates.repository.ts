import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { EmailTemplate } from '../entities/email-template.entity';

@Injectable()
export class EmailTemplatesRepository extends BaseRepository<EmailTemplate> {
  constructor(
    @InjectRepository(EmailTemplate) private readonly emailTemplateRepo: Repository<EmailTemplate>,
    @InjectDataSource() dataSource: DataSource,
  ) {
    super(EmailTemplate, dataSource);
  }

  async findLatestVersionByKeyAndLanguage(templateKey: string, language: string) {
    return await this.emailTemplateRepo.findOne({
      where: { templateKey, language },
      order: { version: 'DESC' },
    });
  }
}
