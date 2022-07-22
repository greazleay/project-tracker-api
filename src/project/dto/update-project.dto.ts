import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString, MinDate } from 'class-validator';
import { CreateProjectDto } from './create-project.dto';

export class UpdateProjectDto extends PartialType(CreateProjectDto) { }

export class UpdateOtherProjectDetailsDto {

    @IsString()
    @IsNotEmpty()
    projectName: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @Transform(({ value }) => new Date(value))
    @IsDate()
    @MinDate(new Date())
    completionDate: Date;
}
