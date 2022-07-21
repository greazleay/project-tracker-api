import { Transform } from "class-transformer";
import { IsDate, IsEnum, IsString, MinDate, MinLength } from "class-validator";
import { ProjectPriority, ProjectStatus } from "../interfaces/project.interface";


export class CreateProjectDto {
    @IsString()
    @MinLength(1)
    projectName: string;

    @IsString()
    @MinLength(1)
    description: string;

    @IsEnum(ProjectStatus)
    projectStatus: ProjectStatus

    @IsEnum(ProjectPriority)
    projectPriority: ProjectPriority

    @Transform(({ value }) => new Date(value))
    @IsDate()
    @MinDate(new Date())
    completionDate: Date;

}
