import {
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { Project } from './entities/project.entity';
import { ProjectAccess } from './entities/project-access.entity';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AccessType } from './interfaces/project.interface';
import { Action } from '../casl/dto/casl.dto';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { AddProjectMembersDto, ModifyProjectMemberAccessDto, RemoveProjectMembersDto } from './dto/common-project.dto';

@Injectable()
export class ProjectService {

  constructor(
    @InjectRepository(Project) private readonly projectRepository: Repository<Project>,
    @InjectRepository(ProjectAccess) private readonly projectAccessRepository: Repository<ProjectAccess>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly caslAbilityFactory: CaslAbilityFactory
  ) { }

  async create(createProjectDto: CreateProjectDto, user: User): Promise<Project> {
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

  async findOneById(id: string, user: User): Promise<Project> {
    try {

      // Check if Project with the specified ID exists and load it's members
      const project = await this.projectRepository
        .createQueryBuilder('project')
        .leftJoinAndSelect('project.members', 'member')
        .where('project.id = :id', { id })
        .getOne();

      if (!project) throw new NotFoundException(`Project with name: ${id} not found on this server`);

      // Check if the user has required read permission on the project
      const projectAccess = await this.projectAccessRepository.findOneBy({ userId: user.id, projectId: id })
      const ability = this.caslAbilityFactory.createForUser(user, project)

      if (ability.can(Action.Read, projectAccess)) return project;

      throw new ForbiddenException('Insufficient Permission to Perform the Requested Action')

    } catch (error) {
      console.error(error);
      throw new HttpException(
        error.message ?? 'SOMETHING WENT WRONG',
        error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOneByName(name: string, user: User): Promise<Project> {
    try {

      // Check if Project with specified name exists and load it's members
      const project = await this.projectRepository
        .createQueryBuilder('project')
        .leftJoinAndSelect('project.members', 'member')
        .where('project.projectName = :name', { name })
        .getOne()

      if (!project) throw new NotFoundException(`Project with name: ${name} not found on this server`);

      // Load Project Access and Check if the user has required read permission on the project
      const projectAccess = await this.projectAccessRepository.findOneBy({ userId: user.id, projectId: project.id })
      const ability = this.caslAbilityFactory.createForUser(user, project)

      if (ability.can(Action.Read, projectAccess)) return project;

      throw new ForbiddenException('Insufficient Permission to Perform the Requested Action')

    } catch (error) {
      console.error(error);
      throw new HttpException(
        error.message ?? 'SOMETHING WENT WRONG',
        error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addProjectMember(addProjectMembersDto: AddProjectMembersDto, user: User) {
    try {
      const { projectId, membersToAdd } = addProjectMembersDto;

      // Check if Project with the specified ID exists and load it's members
      const project = await this.projectRepository
        .createQueryBuilder('project')
        .leftJoinAndSelect('project.members', 'member')
        .where('project.id = :projectId', { projectId })
        .getOne();

      if (!project) throw new NotFoundException(`Project with name: ${projectId} not found on this server`);

      // Load Project Access and Check if the user has required read permission on the project
      const projectAccess = await this.projectAccessRepository.findOneBy({ userId: user.id, projectId: project.id })
      const ability = this.caslAbilityFactory.createForUser(user, project)

      if (ability.can(Action.Manage, projectAccess)) {

        // Loop through membersToAdd Array and check for matching conditions
        for (const member of membersToAdd) {

          // Check if member is already added to the project and skip
          if (project.members.some(item => item.userId === member.memberId)) continue;

          // Check Whether member exists on the Server  
          const user = await this.userRepository.findOneBy({ id: member.memberId })
          if (!user) throw new NotFoundException(`User with id: ${member.memberId} does not exist on this server`)

          // Add Member to Project with the specified Access Type
          const projectAccessType = new ProjectAccess();
          projectAccessType.accessType = member.memberAccessType;
          projectAccessType.userId = member.memberId;
          projectAccessType.projectId = project.id

          await this.projectAccessRepository.save(projectAccessType)
        }

        return { status: 'SUCCESS', message: `Specified members added to ${project.projectName} project` }
      }

      throw new ForbiddenException('Insufficient Permission to Perform the Requested Action')

    } catch (error) {
      console.error(error);
      throw new HttpException(
        error.message ?? 'SOMETHING WENT WRONG',
        error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeProjectMember(removeProjectMembersDto: RemoveProjectMembersDto, user: User) {
    try {
      const { projectId, membersToRemove } = removeProjectMembersDto;

      // Check if Project with the specified ID exists and load it's members
      const project = await this.projectRepository
        .createQueryBuilder('project')
        .leftJoinAndSelect('project.members', 'member')
        .where('project.id = :projectId', { projectId })
        .getOne();

      if (!project) throw new NotFoundException(`Project with name: ${projectId} not found on this server`);

      // Load Project Access and Check if the user has required read permission on the project
      const projectAccess = await this.projectAccessRepository.findOneBy({ userId: user.id, projectId: project.id });
      const ability = this.caslAbilityFactory.createForUser(user, project);

      if (ability.can(Action.Manage, projectAccess)) {

        // Loop through membersToRemove Array and check for matching conditions
        for (const member of membersToRemove) {

          // Check if member doesn't belong to the project and skip
          if (!project.members.some(item => item.userId === member)) continue;

          // Check Whether member exists on the Server  
          const user = await this.userRepository.findOneBy({ id: member });
          if (!user) throw new NotFoundException(`User with id: ${member} does not exist on this server`);

          // Remove member from Project
          const removeMemberFromProject = await this.projectAccessRepository.findOne({ where: { projectId: project.id, userId: member } });
          await this.projectAccessRepository.remove(removeMemberFromProject);
        }

        return { status: 'SUCCESS', message: `Specified members Removed from ${project.projectName} project` };
      }

      throw new ForbiddenException('Insufficient Permission to Perform the Requested Action')

    } catch (error) {
      console.error(error);
      throw new HttpException(
        error.message ?? 'SOMETHING WENT WRONG',
        error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async modifyMembersProjectAccess(modifyMemberAccessDto: ModifyProjectMemberAccessDto, user: User) {
    try {
      const { projectId, membersToModify } = modifyMemberAccessDto;

      // Check if Project with the specified ID exists and load it's members
      const project = await this.projectRepository
        .createQueryBuilder('project')
        .leftJoinAndSelect('project.members', 'member')
        .where('project.id = :projectId', { projectId })
        .getOne();

      if (!project) throw new NotFoundException(`Project with name: ${projectId} not found on this server`);

      // Load Project Access and Check if the user has required read permission on the project
      const projectAccess = await this.projectAccessRepository.findOneBy({ userId: user.id, projectId: project.id });
      const ability = this.caslAbilityFactory.createForUser(user, project);

      if (ability.can(Action.Manage, projectAccess)) {

        // Loop through membersToRemove Array and check for matching conditions
        for (const member of membersToModify) {

          // Check Whether member exists on the Server  
          const user = await this.userRepository.findOneBy({ id: member.memberId })
          if (!user) throw new NotFoundException(`User with id: ${member.memberId} does not exist on this server`)

          // Modify member access on Project
          const modifyMemberAccess = await this.projectAccessRepository.findOne({ where: { projectId: project.id, userId: member.memberId } });
          modifyMemberAccess.accessType = member.memberAccessType
          await this.projectAccessRepository.save(modifyMemberAccess);
        }

        return { status: 'SUCCESS', message: `Access for Specified Members have been modified on ${project.projectName} project` };
      }

      throw new ForbiddenException('Insufficient Permission to Perform the Requested Action')

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
