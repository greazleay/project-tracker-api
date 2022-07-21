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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { PaginateQuery } from 'nestjs-paginate';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UserDecorator } from '../user/decorators/user.decorator';
import { User } from '../user/entities/user.entity';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../user/interfaces/user.interface';
import {
  AddProjectMembersDto,
  ModifyProjectMemberAccessDto,
  ProjectIdDto,
  ProjectNameDto,
  ProjectPriorityDto,
  ProjectStatusDto,
  RemoveProjectMembersDto,
  UpdateProjectPriorityDto,
  UpdateProjectStatusDto
} from './dto/common-project.dto';
import { Project } from './entities/project.entity';


@Controller('projects',)
@ApiTags('Projects')
@ApiBearerAuth()
export class ProjectController {
  constructor(private readonly projectService: ProjectService) { }

  @Get('all')
  @Roles(Role.PROJECT_ADMIN)
  @ApiOperation({
    description: 'Returns All Projects on the Server, only Users with Project Admin Privileges can make a successful request to this endpoint. Request can be paginated'
  })
  @ApiOkResponse({
    description: 'SUCCESS: All Projects on the server returned',
    type: Array<Project>
  })
  @ApiUnauthorizedResponse({
    description: 'Access Token supplied with the request has expired or is invalid'
  })
  @ApiForbiddenResponse({
    description: 'User does not have the Required Permission for the requested operation'
  })
  @ApiInternalServerErrorResponse({
    description: 'An Internal Error Occurred while processing the request'
  })
  async findAll(@Query() query: PaginateQuery) {
    return await this.projectService.findAll(query);
  };

  @Get('all-by-user')
  @ApiOperation({
    description: 'Returns All Projects having the specified user as a member'
  })
  @ApiOkResponse({
    description: 'SUCCESS: All Projects for the specified user on the server returned',
    type: Array<Project>
  })
  @ApiUnauthorizedResponse({
    description: 'Access Token supplied with the request has expired or is invalid'
  })
  @ApiForbiddenResponse({
    description: 'User does not have the Required Permission for the requested operation'
  })
  @ApiInternalServerErrorResponse({
    description: 'An Internal Error Occurred while processing the request'
  })
  async findAllByUser(@UserDecorator('id') id: string) {
    return await this.projectService.findAllProjectsByUser(id)
  }

  @Get('get-by-name')
  @ApiOperation({
    description: 'Searches for A Project by project name, only members of the project with the specifed project name can make a successful request to this endpoint'
  })
  @ApiOkResponse({
    description: 'SUCCESS: Project with the specified name on the server returned'
  })
  @ApiBadRequestResponse({
    description: 'Request Query is empty or contains unacceptable values'
  })
  @ApiUnauthorizedResponse({
    description: 'Access Token supplied with the request has expired or is invalid'
  })
  @ApiForbiddenResponse({
    description: 'User does not have the Required Permission for the requested operation'
  })
  @ApiNotFoundResponse({
    description: 'Project with the specified name does not exist on the server'
  })
  @ApiInternalServerErrorResponse({
    description: 'An Internal Error Occurred while processing the request'
  })
  async findOneByName(@Query() query: ProjectNameDto, @UserDecorator() user: User) {
    const { projectName } = query;
    return await this.projectService.findOneByName(projectName, user);
  }

  @Get('get-by-status')
  @Roles(Role.PROJECT_ADMIN)
  @ApiOperation({
    description: 'Returns All Projects on the Server filtered by project status, only Users with Project Admin Privileges can make a successful request to this endpoint. Request can be paginated'
  })
  @ApiOkResponse({
    description: 'SUCCESS: Project(s) with current status as specified in the request returned'
  })
  @ApiBadRequestResponse({
    description: 'Required Request Query is empty or contains unacceptable values'
  })
  @ApiUnauthorizedResponse({
    description: 'Access Token supplied with the request has expired or is invalid'
  })
  @ApiForbiddenResponse({
    description: 'User does not have the Required Permission for the requested operation'
  })
  @ApiInternalServerErrorResponse({
    description: 'An Internal Error Occurred while processing the request'
  })
  async findByProjectStatus(@Query() statusQuery: ProjectStatusDto, @Query() query: PaginateQuery) {
    const { projectStatus } = statusQuery;
    return await this.projectService.findProjectByStatus(projectStatus, query);
  }

  @Get('get-by-priority')
  @Roles(Role.PROJECT_ADMIN)
  @ApiOperation({
    description: 'Returns All Projects on the Server filtered by project priority, only Users with Project Admin Privileges can make a successful request to this endpoint. Request can be paginated'
  })
  @ApiOkResponse({
    description: 'SUCCESS: Project(s) with current priority as specified in the request returned'
  })
  @ApiBadRequestResponse({
    description: 'Required Request Query is empty or contains unacceptable values'
  })
  @ApiUnauthorizedResponse({
    description: 'Access Token supplied with the request has expired or is invalid'
  })
  @ApiForbiddenResponse({
    description: 'User does not have the Required Permission for the requested operation'
  })
  @ApiInternalServerErrorResponse({
    description: 'An Internal Error Occurred while processing the request'
  })
  async findByProjectPriority(@Query() priorityQuery: ProjectPriorityDto, @Query() query: PaginateQuery) {
    const { projectPriority } = priorityQuery;
    return await this.projectService.findProjectByPriority(projectPriority, query);
  }

  @Get('get-by-id/:projectId')
  @ApiOperation({
    description: 'Returns a Project By project ID, only members of the project with the specifed ID can make a successful request to this endpoint'
  })
  @ApiOkResponse({
    description: 'SUCCESS: Project with the specified ID on the server returned'
  })
  @ApiBadRequestResponse({
    description: 'Required Request Parameter is empty or contains unacceptable values'
  })
  @ApiUnauthorizedResponse({
    description: 'Access Token supplied with the request has expired or is invalid'
  })
  @ApiForbiddenResponse({
    description: 'User does not have the Required Permission for the requested operation'
  })
  @ApiNotFoundResponse({
    description: 'Project with the specified ID does not exist on the server'
  })
  @ApiInternalServerErrorResponse({
    description: 'An Internal Error Occurred while processing the request'
  })
  async findOneById(@Param() params: ProjectIdDto, @UserDecorator() user: User) {
    const { projectId } = params;
    return await this.projectService.findOneById(projectId, user);
  }

  @Post('create')
  @ApiOperation({
    description: 'Creates a new Project and adds the user making the request as the Project Manager'
  })
  @ApiCreatedResponse({
    description: 'SUCCESS: Project created with the details in the request body'
  })
  @ApiBadRequestResponse({
    description: 'Required Request Body is empty or contains unacceptable values'
  })
  @ApiUnauthorizedResponse({
    description: 'Access Token supplied with the request has expired or is invalid'
  })
  @ApiForbiddenResponse({
    description: 'User does not have the Required Permission for the requested operation'
  })
  @ApiConflictResponse({
    description: 'Project with the specified projectName already exists on the server'
  })
  @ApiInternalServerErrorResponse({
    description: 'An Internal Error Occurred while processing the request'
  })
  async create(@Body() createProjectDto: CreateProjectDto, @UserDecorator() user: User) {
    return await this.projectService.create(createProjectDto, user);
  }

  @Put('add-project-member')
  @ApiOperation({
    description: 'Adds new member(s) to a Project, only project members designated as Project Managers on a project can add new members. \n Single/Multiple members can be added per request'
  })
  @ApiOkResponse({
    description: 'SUCCESS: Specified Member(s) added to the target project'
  })
  @ApiBadRequestResponse({
    description: 'Required Request Body is empty or contains unacceptable values'
  })
  @ApiUnauthorizedResponse({
    description: 'Access Token supplied with the request has expired or is invalid'
  })
  @ApiForbiddenResponse({
    description: 'User does not have the Required Permission for the requested operation'
  })
  @ApiNotFoundResponse({
    description: 'Project with the specified ID does not exist on the server'
  })
  @ApiNotFoundResponse({
    description: 'Member to be added with the specified ID does not exist on the server'
  })
  @ApiInternalServerErrorResponse({
    description: 'An Internal Error Occurred while processing the request'
  })
  async addMemberToProject(@Body() addProjectMembersDto: AddProjectMembersDto, @UserDecorator() user: User) {
    return await this.projectService.addProjectMember(addProjectMembersDto, user);
  }

  @Put('remove-project-member')
  @ApiOperation({
    description: 'Removes member(s) from a Project, only project members designated as Project Managers on a project can remove project members, \n Single/Multiple members can be removed per request'
  })
  @ApiOkResponse({
    description: 'SUCCESS: Specified Member(s) removed from the target project'
  })
  @ApiBadRequestResponse({
    description: 'Required Request Body is empty or contains unacceptable values'
  })
  @ApiUnauthorizedResponse({
    description: 'Access Token supplied with the request has expired or is invalid'
  })
  @ApiForbiddenResponse({
    description: 'User does not have the Required Permission for the requested operation'
  })
  @ApiNotFoundResponse({
    description: 'Project with the specified ID does not exist on the server'
  })
  @ApiNotFoundResponse({
    description: 'Member to be removed with the specified ID does not exist on the server'
  })
  @ApiInternalServerErrorResponse({
    description: 'An Internal Error Occurred while processing the request'
  })
  async removeMemberFromProject(@Body() removeProjectMembersDto: RemoveProjectMembersDto, @UserDecorator() user: User) {
    return await this.projectService.removeProjectMember(removeProjectMembersDto, user);
  }

  @Patch('modify-project-member-access')
  @ApiOperation({
    description: 'Modifies the access right for member(s) on a Project, only project members designated as Project Managers on a project can remove project members, \n Single/Multiple members can be removed per request'
  })
  @ApiOkResponse({
    description: 'SUCCESS: Modified Project Access for specified member(s) on the target project'
  })
  @ApiBadRequestResponse({
    description: 'Required Request Body is empty or contains unacceptable values'
  })
  @ApiUnauthorizedResponse({
    description: 'Access Token supplied with the request has expired or is invalid'
  })
  @ApiForbiddenResponse({
    description: 'User does not have the Required Permission for the requested operation'
  })
  @ApiNotFoundResponse({
    description: 'Project with the specified ID does not exist on the server'
  })
  @ApiNotFoundResponse({
    description: 'Member ID with access to be modified does not exist on the server'
  })
  @ApiInternalServerErrorResponse({
    description: 'An Internal Error Occurred while processing the request'
  })
  async modifyProjectMemberAccess(@Body() modifyProjectAccessDto: ModifyProjectMemberAccessDto, @UserDecorator() user: User) {
    return await this.projectService.modifyMembersProjectAccess(modifyProjectAccessDto, user)
  }

  @Patch('update-project-status')
  @ApiOperation({
    description: 'Updates the status of a Project, only project members designated as collaborators on a project can can update the status of a project'
  })
  @ApiOkResponse({
    description: 'SUCCESS: Status for target project updated successfully with the details in specified in the request body'
  })
  @ApiBadRequestResponse({
    description: 'Required Request Body is empty or contains unacceptable values'
  })
  @ApiUnauthorizedResponse({
    description: 'Access Token supplied with the request has expired or is invalid'
  })
  @ApiForbiddenResponse({
    description: 'User does not have the Required Permission for the requested operation'
  })
  @ApiNotFoundResponse({
    description: 'Project with the specified ID does not exist on the server'
  })
  @ApiInternalServerErrorResponse({
    description: 'An Internal Error Occurred while processing the request'
  })
  async updateProjectStatus(@Body() updateProjectStatusDto: UpdateProjectStatusDto, @UserDecorator() user: User) {
    return await this.projectService.updateProjectStatus(updateProjectStatusDto, user)
  }

  @Patch('update-project-priority')
  @ApiOperation({
    description: 'Updates the priority of a Project, only project members designated as collaborators on a project can can update the priority of a project'
  })
  @ApiOkResponse({
    description: 'SUCCESS: Priority for target project updated successfully with the details in specified in the request body'
  })
  @ApiBadRequestResponse({
    description: 'Required Request Body is empty or contains unacceptable values'
  })
  @ApiUnauthorizedResponse({
    description: 'Access Token supplied with the request has expired or is invalid'
  })
  @ApiForbiddenResponse({
    description: 'User does not have the Required Permission for the requested operation'
  })
  @ApiNotFoundResponse({
    description: 'Project with the specified ID does not exist on the server'
  })
  @ApiInternalServerErrorResponse({
    description: 'An Internal Error Occurred while processing the request'
  })
  async updateProjectPriority(@Body() updateProjectPriorityDto: UpdateProjectPriorityDto, @UserDecorator() user: User) {
    return await this.projectService.updateProjectPriority(updateProjectPriorityDto, user)
  }

  @Patch(':id')
  @ApiOperation({
    description: 'Updates Other Project Properties, THIS ENDPOINT IS NOT YET COMPLETE'
  })
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.update(+id, updateProjectDto);
  }

  @Delete(':id')
  @ApiOperation({
    description: 'Deletes a Project, THIS ENDPOINT IS NOT YET COMPLETE'
  })
  remove(@Param('id') id: string) {
    return this.projectService.remove(+id);
  }
}
