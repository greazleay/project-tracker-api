import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';
import { Repository } from 'typeorm';
import { ProjectService } from '../project/project.service';
import { User } from '../user/entities/user.entity';
import { IssueIdAndProjectIdDto, IssueTitleAndProjectIdDto, ReassignIssueDto } from './dto/common-issue.dto';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto, UpdateIssueStatusDto } from './dto/update-issue.dto';
import { Issue } from './entities/issue.entity';
import { IssueStatus } from './interfaces/issues.interface';

@Injectable()
export class IssueService {

  constructor(
    @InjectRepository(Issue) private readonly issueRepository: Repository<Issue>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly projectService: ProjectService
  ) { }

  async findAll(query: PaginateQuery): Promise<Paginated<Issue>> {
    try {
      return await paginate(query, this.issueRepository, {
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

  async findOneById(issueIdAndProjectIdDto: IssueIdAndProjectIdDto, user: User) {
    try {

      const { issueId, projectId } = issueIdAndProjectIdDto;

      // Check if the project exists and user has required read right on the project
      await this.projectService.findOneById(projectId, user);

      const issue = await this.issueRepository
        .createQueryBuilder('issue')
        .leftJoinAndSelect('issue.assignedTo', 'assignedTo')
        .leftJoinAndSelect('issue.project', 'project')
        .where('issue.id = :issueId', { issueId })
        .select([
          'issue.id',
          'issue.description',
          'issue.issueTitle',
          'issue.issueType',
          'issue.issuePriority',
          'issue.issueStatus',
          'issue.dueDate',
          'issue.createdAt',
          'issue.updatedAt',
          'issue.dateClosed',
          'issue.resolutionSummary',
          'project.id',
          'project.projectName',
          'project.projectStatus',
          'assignedTo.id'
        ])
        .getOne()

      if (!issue) throw new NotFoundException(`Issue with ID: ${issueId} not found in Project with ID: ${projectId}`)

      return issue;

    } catch (error) {
      console.error(error);
      throw new HttpException(
        error.message ?? 'SOMETHING WENT WRONG',
        error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOneByTitle(issueTitleAndProjectIdDto: IssueTitleAndProjectIdDto, user: User) {
    try {

      const { issueTitle, projectId } = issueTitleAndProjectIdDto;
      // Check if the project exists and user has required read right on the project
      await this.projectService.findOneById(projectId, user);

      const issue = await this.issueRepository
        .createQueryBuilder('issue')
        .leftJoinAndSelect('issue.assignedTo', 'assignedTo')
        .leftJoinAndSelect('issue.project', 'project')
        .where('issue.issueTitle = :issueTitle', { issueTitle })
        .select([
          'issue.id',
          'issue.description',
          'issue.issueTitle',
          'issue.issueType',
          'issue.issuePriority',
          'issue.issueStatus',
          'issue.dueDate',
          'issue.createdAt',
          'issue.updatedAt',
          'issue.dateClosed',
          'issue.resolutionSummary',
          'project.id',
          'project.projectName',
          'project.projectStatus',
          'assignedTo.id'
        ])
        .getOne()

      if (!issue) throw new NotFoundException(`Issue with title: '${issueTitle}' not found in Project with ID: ${projectId}`)

      return issue;

    } catch (error) {
      console.error(error);
      throw new HttpException(
        error.message ?? 'SOMETHING WENT WRONG',
        error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllOverdueIssues(query: PaginateQuery): Promise<Paginated<Issue>> {
    try {
      const foundIssue = this.issueRepository
        .createQueryBuilder('issue')
        .where('issue.dueDate < :today', { today: new Date() })

      return paginate<Issue>(query, foundIssue, {
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

  async findAllOverdueIssuesOnAProject(projectId: string, query: PaginateQuery): Promise<Paginated<Issue>> {
    try {
      const foundIssue = this.issueRepository
        .createQueryBuilder('issue')
        .leftJoinAndSelect('issue.project', 'project')
        .having('project.id = :projectId', { projectId })
        .andHaving('issue.dueDate < :today', { today: new Date() })

      return paginate<Issue>(query, foundIssue, {
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

  async create(createIssueDto: CreateIssueDto, user: User) {
    try {
      const { issueTitle, projectId, userAssignedTo, dueDate, ...rest } = createIssueDto;

      // Check if the project exists and user has required update right on the project
      const project = await this.projectService.manageProjectIssues(projectId, user)

      // Check if there is an Issue with similar title on the project
      if (project.projectIssues.some(issue => issue.issueTitle === issueTitle))
        throw new ConflictException(`Issue with title: '${issueTitle}' already exists on ${project.projectName} project`);

      // Check if User to assign the issue to is a member of the project
      if (!project.members.some(member => member.userId === userAssignedTo))
        throw new ConflictException(`Cannot assign issue to User with ID: ${userAssignedTo}, user not a member of this project`);

      // Check if the Issue dueDate does not exceed project completion date
      if (new Date(dueDate) > new Date(project.completionDate))
        throw new ConflictException(`Issue dueDate cannot be greater than Project completionDate`)

      // Prepare New Issue Object and Save
      const issueToOpen = new Issue();
      issueToOpen.issueTitle = issueTitle;
      issueToOpen.description = rest.description;
      issueToOpen.issueType = rest.issueType;
      issueToOpen.issuePriority = rest.issuePriority;
      issueToOpen.issueStatus = rest.issueStatus;
      issueToOpen.dueDate = dueDate;
      issueToOpen.project = project;
      issueToOpen.openedBy = user;
      issueToOpen.assignedTo = await this.userRepository.findOneBy({ id: userAssignedTo })

      return await this.issueRepository.save(issueToOpen);

    } catch (error) {
      console.error(error);
      throw new HttpException(
        error.message ?? 'SOMETHING WENT WRONG',
        error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async reassignIssue(reassignIssueDto: ReassignIssueDto, user: User) {
    try {

      const { projectId, issueId, userToReassignTo } = reassignIssueDto;

      // Check if the project exists and user has required update right on the project
      const project = await this.projectService.manageProjectIssues(projectId, user);

      // Check if specified issueId exists on the project
      if (!project.projectIssues.some(issue => issue.id === issueId))
        throw new NotFoundException(`Issue with ID: '${issueId}' does not exist on ${project.projectName} project`);

      const issueToUpdate = await this.issueRepository
        .createQueryBuilder('issue')
        .leftJoinAndSelect('issue.assignedTo', 'assignedTo')
        .where('issue.id = :issueId', { issueId })
        .select([
          'issue.id',
          'assignedTo.id'
        ])
        .getOne()

      if (issueToUpdate.assignedTo.id === userToReassignTo)
        throw new ConflictException(`Issue already assigned to User with ID: ${userToReassignTo}`);

      issueToUpdate.assignedTo = await this.userRepository.findOneBy({ id: userToReassignTo });

      await this.issueRepository.save(issueToUpdate)

      return { status: 'SUCCESS', message: `Issue Reassigned to user with ID ${userToReassignTo}` }


    } catch (error) {
      console.error(error);
      throw new HttpException(
        error.message ?? 'SOMETHING WENT WRONG',
        error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async closeIssue(closeIssue: IssueIdAndProjectIdDto, user: User) {
    try {

      const { issueId, projectId } = closeIssue;

      // Check if the project exists and user has required update right on the project
      const project = await this.projectService.manageProjectIssues(projectId, user);

      // Check if specified issueId exists on the project
      if (!project.projectIssues.some(issue => issue.id === issueId))
        throw new NotFoundException(`Issue with ID: '${issueId}' does not exist on ${project.projectName} project`);

      const issueToClose = await this.issueRepository.findOneBy({ id: issueId })
      if (!issueToClose) throw new NotFoundException(`Issue with ID: ${issueId} not found`)

      issueToClose.issueStatus = IssueStatus.RESOLVED;
      issueToClose.closedBy = user;
      issueToClose.dateClosed = new Date()

      return await this.issueRepository.save(issueToClose)

    } catch (error) {
      console.error(error);
      throw new HttpException(
        error.message ?? 'SOMETHING WENT WRONG',
        error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateIssueStatus(issueId: string, updateIssueDto: UpdateIssueStatusDto, user: User) {
    try {
      const { projectId, issueStatus } = updateIssueDto;

      // Check if the project exists and user has required update right on the project
      const project = await this.projectService.manageProjectIssues(projectId, user);

      // Check if specified issueId exists on the project
      if (!project.projectIssues.some(issue => issue.id === issueId))
        throw new NotFoundException(`Issue with ID: '${issueId}' does not exist on ${project.projectName} project`);

      const issueToUpdate = await this.issueRepository.findOneBy({ id: issueId })
      if (!issueToUpdate) throw new NotFoundException(`Issue with ID: ${issueId} not found`)

      issueToUpdate.issueStatus = issueStatus;

      return await this.issueRepository.save(issueToUpdate);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        error.message ?? 'SOMETHING WENT WRONG',
        error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  remove(id: number) {
    return `This action removes a #${id} issue`;
  }
}
