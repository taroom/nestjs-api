import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { ErrorFilter } from './common/error.filter';
@Module({
  imports: [CommonModule, UserModule],
  controllers: [],
  providers: [ErrorFilter],
})
export class AppModule { }
