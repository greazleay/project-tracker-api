import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { IssueService } from './issue.service';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { UserDecorator } from '../user/decorators/user.decorator';
import { User } from '../user/entities/user.entity';
import { IssueIdAndProjectIdDto, IssueTitleAndProjectIdDto, ReassignIssueDto } from './dto/common-issue.dto';
import { PaginateQuery } from 'nestjs-paginate';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/user/interfaces/user.interface';

@Controller({
  path: 'issues',
  version: '1'
})
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
    description: `Issue with the specified issueTitle already exists on the target project/
    User to assign the issue to is not a member of the project/
    Issue dueDate exceeds the Project completion date
    `
  })
  @ApiInternalServerErrorResponse({
    description: 'An Internal Error Occurred while processing the request'
  })
  async create(@Body() createIssueDto: CreateIssueDto, @UserDecorator() user: User) {
    return await this.issueService.create(createIssueDto, user);
  };

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
  @ApiOperation({
    description: 'Returns all Issues on the Server. Only User(s) with Project Admin privileges can make a successful request to this endpoint. Request can be paginated'
  })
  @ApiOkResponse({
    description: 'SUCCESS: All Issues on the server returned'
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
    return await this.issueService.findAll(query);
  }

  @Get('get-by-title')
  @ApiOperation({
    description: 'Returns the Issue with the specified title on a target Project, User must have at least viewer rights on the project to be able to make a successful request'
  })
  @ApiOkResponse({
    description: 'SUCCESS: Issue with the specified title found and returned'
  })
  @ApiBadRequestResponse({
    description: 'Required Request Query parameter is empty or contains unacceptable values'
  })
  @ApiUnauthorizedResponse({
    description: 'Access Token supplied with the request has expired or is invalid'
  })
  @ApiForbiddenResponse({
    description: 'User does not have the Required Permission for the requested operation'
  })
  @ApiNotFoundResponse({
    description: 'Issue with the specified issueTitle does not exist on the target Project'
  })
  @ApiInternalServerErrorResponse({
    description: 'An Internal Error Occurred while processing the request'
  })
  async findOneById(@Query() query: IssueTitleAndProjectIdDto, @UserDecorator() user: User) {
    return await this.issueService.findOneByTitle(query, user);
  }

  @Get('get-by-id')
  @ApiOperation({
    description: 'Returns the Issue with the specified ID on a target Project, User must have at least viewer rights on the project to be able to make a successful request'
  })
  @ApiOkResponse({
    description: 'SUCCESS: Issue with the specified ID found and returned'
  })
  @ApiBadRequestResponse({
    description: 'Required Request Query parameter is empty or contains unacceptable values'
  })
  @ApiUnauthorizedResponse({
    description: 'Access Token supplied with the request has expired or is invalid'
  })
  @ApiForbiddenResponse({
    description: 'User does not have the Required Permission for the requested operation'
  })
  @ApiNotFoundResponse({
    description: 'Issue with the specified ID does not exist on the target Project'
  })
  @ApiInternalServerErrorResponse({
    description: 'An Internal Error Occurred while processing the request'
  })
  async findIssueById(@Query() query: IssueIdAndProjectIdDto, @UserDecorator() user: User) {
    return await this.issueService.findOneById(query, user);
  };

  @Get('all-overdue')
  @Roles(Role.PROJECT_ADMIN)
  @ApiOperation({
    description: 'Returns all Over Issues on the entire server. Only User(s) with Project Admin privileges can make a successful request to this endpoint. Request can be paginated'
  })
  @ApiOkResponse({
    description: 'SUCCESS: All Issues on the server returned'
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
  async findAllOverdueIssues(@Query() query: PaginateQuery) {
    return await this.issueService.findAllOverdueIssues(query);
  }

  @Patch(':id')
  @ApiOperation({
    description: 'Updates Other Issue Properties, THIS ENDPOINT IS NOT YET COMPLETE'
  })
  update(@Param('id') id: string, @Body() updateIssueDto: UpdateIssueDto) {
    return this.issueService.update(+id, updateIssueDto);
  };

  @Delete(':id')
  @ApiOperation({
    description: 'Deletes an Issue, THIS ENDPOINT IS NOT YET COMPLETE'
  })
  remove(@Param('id') id: string) {
    return this.issueService.remove(+id);
  };
}
