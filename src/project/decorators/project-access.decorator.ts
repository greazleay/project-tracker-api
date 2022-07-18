import { SetMetadata } from '@nestjs/common';
import { ProjectAccess } from '../interfaces/project.interface';

export const PROJECT_ACCESS_KEY = 'project_access';
export const ProjectAccessType = (project_access: ProjectAccess) => SetMetadata(PROJECT_ACCESS_KEY, project_access);