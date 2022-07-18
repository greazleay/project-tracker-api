import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { APP_GUARD } from '@nestjs/core';
import { ProjectAccessGuard } from './guards/project-access.guard';

@Module({
  controllers: [ProjectController],
  providers: [
    ProjectService,
    {
      provide: APP_GUARD,
      useClass: ProjectAccessGuard,
    },
  ]
})
export class ProjectModule { }
