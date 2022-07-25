import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { CreateIssueDto } from './create-issue.dto';
import { IssueStatusWithoutClose } from '../interfaces/issues.interface';

export class UpdateIssueDto extends PartialType(CreateIssueDto) { }

export class UpdateIssueStatusDto {

    @IsUUID(4)
    projectId: string;
    
    @IsString()
    @IsNotEmpty()
    issueStatus: IssueStatusWithoutClose;
}
