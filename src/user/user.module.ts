import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { EmailService } from '../services/email/email.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  exports: [UserService, TypeOrmModule],
  providers: [UserService, EmailService],
  controllers: [UserController]
})
export class UserModule { }