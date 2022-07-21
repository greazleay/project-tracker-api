import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiConflictResponse, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { IssueService } from './issue.service';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { UserDecorator } from '../user/decorators/user.decorator';
import { User } from '../user/entities/user.entity';
import { IssueIdAndProjectIdDto, IssueTitleAndProjectIdDto, ReassignIssueDto } from './dto/common-issue.dto';
import { PaginateQuery } from 'nestjs-paginate';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/user/interfaces/user.interface';

@Controller('v1/issues')
@ApiTags('Issues')
@ApiBearerAuth()
export class IssueController {
  constructor(private readonly issueService: IssueService) { }

  @Post('open-new-issue')
  @ApiOperation({
    description: 'Opens a new issue on the target project specified in the request body with issue details'
  })
  @ApiOkResponse({
    description: 'SUCCESS: Issue Opened with the specified details in the request body'
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
    description: 'Target Project specified in the request body not found'
  })
  @ApiConflictResponse({
    description: 'Issue with the specified issueTitle already exists on the target project'
  })
  @ApiConflictResponse({
    description: 'User to assign the issue to is not a member of the project'
  })
  @ApiInternalServerErrorResponse({
    description: 'An Internal Error Occurred while processing the request'
  })
  async create(@Body() createIssueDto: CreateIssueDto, @UserDecorator() user: User) {
    return await this.issueService.create(createIssueDto, user);
  }

  @Patch('reassign-issue')
  @ApiOperation({
    description: 'Reassignes an existing issue to a new User'
  })
  @ApiOkResponse({
    description: 'SUCCESS: Issue reassigned to the designated User'
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
    description: 'Specified Issue does not exist on the target Project'
  })
  @ApiConflictResponse({
    description: 'Desginated User already assigned to the Issue'
  })
  @ApiInternalServerErrorResponse({
    description: 'An Internal Error Occurred while processing the request'
  })
  async reassignProjectIssue(@Body() reassignIssueDto: ReassignIssueDto, @UserDecorator() user: User) {
    return await this.issueService.reassignIssue(reassignIssueDto, user)
  }

  @Get('all')
  @Roles(Role.PROJECT_ADMIN)
  async findAll(@Query() query: PaginateQuery) {
    return await this.issueService.findAll(query);
  }

  @Get('get-by-title')
  async findOneById(@Query() query: IssueTitleAndProjectIdDto, @UserDecorator() user: User) {
    return await this.issueService.findOneByTitle(query, user);
  }

  @Get('get-by-id')
  async findIssueById(@Query() query: IssueIdAndProjectIdDto, @UserDecorator() user: User) {
    return await this.issueService.findOneById(query, user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIssueDto: UpdateIssueDto) {
    return this.issueService.update(+id, updateIssueDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.issueService.remove(+id);
  }
}
