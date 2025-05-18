import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { EmailTemplate } from '../entities/email-template.entity';
import { EmailTemplateKey } from '../enums/email-template-key.enum';
import { Language } from 'src/common/dto/laguage-type.enum';

@Injectable()
export class EmailTemplatesRepository extends BaseRepository<EmailTemplate> {
  constructor(
    @InjectRepository(EmailTemplate) private readonly emailTemplateRepo: Repository<EmailTemplate>,
    @InjectDataSource() dataSource: DataSource,
  ) {
    super(EmailTemplate, dataSource);
  }

  async findLatestVersionByKeyAndLanguage(templateKey: EmailTemplateKey, language: Language) {
    return await this.emailTemplateRepo.findOne({
      where: { templateKey, language },
      order: { version: 'DESC' },
    });
  }

  async createTemplate(emailTemplate: EmailTemplate) {
    return await this.emailTemplateRepo.save(emailTemplate)
  }

  async findTemplateById(id: number) {
    return await this.emailTemplateRepo.findOne({
      where: { id },
    });
  }

  // async updateTemplate(emailTemplate: EmailTemplate, language: string) {
  //   const id = emailTemplate.id;
  //   const nextVersion = emailTemplate.version + 1;
  //   return await this.emailTemplateRepo.update({ id, language, version: nextVersion }, emailTemplate)
  // }

}