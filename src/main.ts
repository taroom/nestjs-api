import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ErrorFilter } from './common/error.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);//setting winston sebagai logger utama
  app.useLogger(logger);//setting winston sebagai logger utama

  app.useGlobalFilters(app.get(ErrorFilter));
  await app.listen(3000);
}
bootstrap();
