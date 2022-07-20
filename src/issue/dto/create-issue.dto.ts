import { Transform } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, IsString, IsUUID, MinDate } from 'class-validator';
import { IssuePriority, IssueStatus, IssueType } from '../interfaces/issues.interface';


export class CreateIssueDto {

    @IsString()
    @IsNotEmpty()
    issueTitle: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsUUID(4)
    projectId: string;

    @IsEnum(IssueType)
    issueType: IssueType;

    @IsEnum(IssuePriority)
    issuePriority: IssuePriority;

    @IsEnum(IssueStatus)
    issueStatus: IssueStatus

    @Transform(({ value }) => new Date(value))
    @IsDate()
    @MinDate(new Date())
    dueDate: Date;

    @IsUUID(4)
    userAssignedTo: string

}
