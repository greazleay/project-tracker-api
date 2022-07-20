import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IssueService } from './issue.service';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { UserDecorator } from '../user/decorators/user.decorator';
import { User } from '../user/entities/user.entity';

@ApiTags('Issues')
@Controller('v1/issues')
export class IssueController {
  constructor(private readonly issueService: IssueService) {}

  @Post('open-new-issue')
  async create(@Body() createIssueDto: CreateIssueDto, @UserDecorator() user: User) {
    return await this.issueService.create(createIssueDto, user);
  }

  @Get('all')
  findAll() {
    return this.issueService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.issueService.findOne(+id);
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
