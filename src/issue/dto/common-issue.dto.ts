import { IsUUID } from 'class-validator';

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