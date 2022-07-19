import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsEnum, IsString, IsUUID, MinLength, ValidateNested } from 'class-validator';
import { AccessType } from '../interfaces/project.interface';

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