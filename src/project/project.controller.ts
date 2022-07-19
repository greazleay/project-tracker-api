import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaginateQuery } from 'nestjs-paginate';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UserDecorator } from '../user/decorators/user.decorator';
import { User } from '../user/entities/user.entity';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../user/interfaces/user.interface';
import { AddProjectMembersDto, ModifyProjectMemberAccessDto, ProjectIdDto, ProjectNameDto, ProjectStatusDto, RemoveProjectMembersDto, UpdateProjectPriorityDto, UpdateProjectStatusDto } from './dto/common-project.dto';


@ApiTags('Projects')
@Controller('/v1/projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) { }

  @Get('all')
  @Roles(Role.ADMIN)
  async findAll(@Query() query: PaginateQuery) {
    return await this.projectService.findAll(query);
  }

  @Get('get-by-name')
  async findOneByName(@Query() query: ProjectNameDto, @UserDecorator() user: User) {
    const { projectName } = query;
    return await this.projectService.findOneByName(projectName, user);
  }

  @Get('get-by-status')
  async findByProjectStatus(@Query() status: ProjectStatusDto, @Query() query: PaginateQuery) {
    const { projectStatus } = status;
    return await this.projectService.findProjectByStatus(projectStatus, query);
  }

  @Get('get-by-id/:projectId')
  async findOneById(@Param() params: ProjectIdDto, @UserDecorator() user: User) {
    const { projectId } = params;
    return await this.projectService.findOneById(projectId, user);
  }

  @Post('create')
  async create(@Body() createProjectDto: CreateProjectDto, @UserDecorator() user: User) {
    return await this.projectService.create(createProjectDto, user);
  }

  @Put('add-project-member')
  async addMemberToProject(@Body() addProjectMembersDto: AddProjectMembersDto, @UserDecorator() user: User) {
    return await this.projectService.addProjectMember(addProjectMembersDto, user);
  }

  @Put('remove-project-member')
  async removeMemberFromProject(@Body() removeProjectMembersDto: RemoveProjectMembersDto, @UserDecorator() user: User) {
    return await this.projectService.removeProjectMember(removeProjectMembersDto, user);
  }

  @Patch('modify-project-member-access')
  async modifyProjectMemberAccess(@Body() modifyProjectAccessDto: ModifyProjectMemberAccessDto, @UserDecorator() user: User) {
    return await this.projectService.modifyMembersProjectAccess(modifyProjectAccessDto, user)
  }

  @Patch('update-project-status')
  async updateProjectStatus(@Body() updateProjectStatusDto: UpdateProjectStatusDto, @UserDecorator() user: User) {
    return await this.projectService.updateProjectStatus(updateProjectStatusDto, user)
  }

  @Patch('update-project-priority')
  async updateProjectPriority(@Body() updateProjectPriorityDto: UpdateProjectPriorityDto, @UserDecorator() user: User) {
    return await this.projectService.updateProjectPriority(updateProjectPriorityDto, user)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.update(+id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectService.remove(+id);
  }
}
