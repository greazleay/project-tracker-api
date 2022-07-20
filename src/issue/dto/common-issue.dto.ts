import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ReassignIssueDto {

    @IsUUID(4)
    projectId: string;

    @IsUUID(4)
    issueId: string;

    @IsUUID(4)
    userToReassignTo: string
}

export class IssueIdDto {

    @IsUUID(4)
    issueId: string
}

export class IssueIdAndProjectIdDto {

    @IsUUID(4)
    projectId: string;

    @IsUUID(4)
    issueId: string;
}

export class IssueTitleAndProjectIdDto {

    @IsUUID(4)
    projectId: string;

    @IsString()
    @IsNotEmpty()
    issueTitle: string;
}