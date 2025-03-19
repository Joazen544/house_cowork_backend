import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  initializeTransactionalContext();
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({
    type: VersioningType.URI,
  });

  const config = new DocumentBuilder()
    .setTitle('Your API Title')
    .setDescription('Your API description')
    .setVersion('1.0')
    .addServer('https://housecowork.com/', 'Staging')
    .addTag('Your API Tag')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const configService = app.get(ConfigService);

  checkRequiredEnvVars(configService);

  await app.listen(3000);
}

function checkRequiredEnvVars(configService: ConfigService) {
  const requiredEnvVars = ['AVATARS_BUCKET'];
  requiredEnvVars.forEach((envVar) => {
    if (!configService.get<string>(envVar)) {
      throw new Error(`${envVar} environment variable is not set`);
    }
  });
}

bootstrap();
