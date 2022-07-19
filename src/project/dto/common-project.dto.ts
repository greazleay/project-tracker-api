import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsEnum, IsString, IsUUID, MinLength, ValidateNested } from 'class-validator';
import { AccessType, ProjectPriority, ProjectStatus } from '../interfaces/project.interface';

export class ProjectIdDto {
    @ApiProperty()
    @IsUUID(4)
    readonly projectId: string;
}

export class ProjectNameDto {
    @ApiProperty()
    @IsString()
    @MinLength(1, { message: 'Search Term must be at least 1 character long' })
    readonly projectName: string
}

class ProjectMemberDto {
    @IsUUID(4)
    memberId: string;

    @IsEnum(AccessType)
    memberAccessType: AccessType
}

export class AddProjectMembersDto {
    @ApiProperty()
    @IsUUID(4)
    readonly projectId: string;

    @ApiProperty()
    @ValidateNested({ each: true })
    @ArrayNotEmpty()
    @Type(() => ProjectMemberDto)
    readonly membersToAdd: ProjectMemberDto[]
}

export class RemoveProjectMembersDto {
    @ApiProperty()
    @IsUUID(4)
    readonly projectId: string;

    @ApiProperty()
    @IsUUID(4, { each: true })
    @ArrayNotEmpty()
    readonly membersToRemove: string[]
}

export class ModifyProjectMemberAccessDto {
    @ApiProperty()
    @IsUUID(4)
    readonly projectId: string;

    @ApiProperty()
    @ValidateNested({ each: true })
    @ArrayNotEmpty()
    @Type(() => ProjectMemberDto)
    readonly membersToModify: ProjectMemberDto[]
}

export class UpdateProjectStatusDto {
    @ApiProperty()
    @IsUUID(4)
    readonly projectId: string;

    @ApiProperty()
    @IsEnum(ProjectStatus)
    projectStatus: ProjectStatus

}

export class UpdateProjectPriorityDto {
    @ApiProperty()
    @IsUUID(4)
    readonly projectId: string;

    @ApiProperty()
    @IsEnum(ProjectPriority)
    projectPriority: ProjectPriority

}

export class ProjectStatusDto {
    @ApiProperty()
    @IsEnum(ProjectStatus)
    projectStatus: ProjectStatus
}

export class ProjectPriorityDto {
    @ApiProperty()
    @IsEnum(ProjectPriority)
    projectPriority: ProjectPriority
}