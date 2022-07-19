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
import { ApiTags } from '@nestjs/swagger';
import { PaginateQuery } from 'nestjs-paginate';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UserDecorator } from '../user/decorators/user.decorator';
import { User } from '../user/entities/user.entity';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../user/interfaces/user.interface';


@ApiTags('Projects')
@Controller('/v1/projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) { }

  @Post('create')
  create(@Body() createProjectDto: CreateProjectDto, @UserDecorator() user: User) {
    return this.projectService.create(createProjectDto, user);
  }

  @Get('all')
  @Roles(Role.ADMIN)
  findAll(@Query() query: PaginateQuery) {
    return this.projectService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @UserDecorator() user: User) {
    return this.projectService.findOne(id, user);
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
