import { ConflictException, ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { ProjectAccess } from './entities/project-access.entity';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AccessType, Action } from './interfaces/project.interface';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';

@Injectable()
export class ProjectService {

  constructor(
    @InjectRepository(Project) private readonly projectRepository: Repository<Project>,
    @InjectRepository(ProjectAccess) private readonly projectAccessRepository: Repository<ProjectAccess>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly caslAbilityFactory: CaslAbilityFactory
  ) { }

  async create(createProjectDto: CreateProjectDto, user: User) {
    try {

      // Check if project name already exist
      const { projectName, description, projectPriority, projectStatus } = createProjectDto;
      const isProjectExist = await this.projectRepository.findOneBy({ projectName });
      if (isProjectExist) throw new ConflictException(`Project with name ${projectName} already exist, please choose another name`);


      // Create and Save new Project
      const projectToCreate = new Project()

      projectToCreate.projectName = projectName;
      projectToCreate.description = description;
      projectToCreate.projectPriority = projectPriority;
      projectToCreate.projectStatus = projectStatus;

      await this.projectRepository.save(projectToCreate)

      // Add Creator as Project Manager
      const projectAccessType = new ProjectAccess();
      projectAccessType.accessType = AccessType.MANAGER;
      projectAccessType.userId = user.id;
      projectAccessType.projectId = projectToCreate.id

      await this.projectAccessRepository.save(projectAccessType)

      return projectToCreate

    } catch (error) {
      console.error(error);
      throw new HttpException(
        error.message ?? 'SOMETHING WENT WRONG',
        error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(query: PaginateQuery): Promise<Paginated<Project>> {
    try {
      return await paginate(query, this.projectRepository, {
        sortableColumns: ['createdAt'],
        defaultSortBy: [['createdAt', 'DESC']],
      });
    } catch (error) {
      console.error(error);
      throw new HttpException(
        error.message ?? 'SOMETHING WENT WRONG',
        error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string, user: User) {
    try {

      // Load the Project with it's members and Project Access
      const project = await this.projectRepository
        .createQueryBuilder('project')
        .leftJoinAndSelect('project.members', 'member')
        .where('project.id = :id', { id })
        .getOne()
      const projectAccess = await this.projectAccessRepository.findOneBy({ userId: user.id, projectId: id })

      // Check if the user has required permission read the project
      const ability = this.caslAbilityFactory.createForUser(user, project)
      if (ability.can(Action.Read, projectAccess)) return project;

      throw new ForbiddenException('Insufficient Permission to Perform Requested Action')

    } catch (error) {
      console.error(error);
      throw new HttpException(
        error.message ?? 'SOMETHING WENT WRONG',
        error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
