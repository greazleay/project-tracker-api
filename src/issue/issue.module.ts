import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IssueService } from './issue.service';
import { IssueController } from './issue.controller';
import { ProjectModule } from '../project/project.module';
import { UserModule } from '../user/user.module';
import { Issue } from './entities/issue.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Issue]), ProjectModule, UserModule],
  controllers: [IssueController],
  providers: [IssueService]
})
export class IssueModule { }
