import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IssueService } from './issue.service';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { UserDecorator } from '../user/decorators/user.decorator';
import { User } from '../user/entities/user.entity';
import { IssueIdAndProjectIdDto, IssueTitleAndProjectIdDto, ReassignIssueDto } from './dto/common-issue.dto';
import { PaginateQuery } from 'nestjs-paginate';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/user/interfaces/user.interface';

@ApiTags('Issues')
@Controller('v1/issues')
export class IssueController {
  constructor(private readonly issueService: IssueService) { }

  @Post('open-new-issue')
  async create(@Body() createIssueDto: CreateIssueDto, @UserDecorator() user: User) {
    return await this.issueService.create(createIssueDto, user);
  }

  @Patch('reassign-issue')
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
