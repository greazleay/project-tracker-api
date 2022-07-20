import { ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectService } from '../project/project.service';
import { User } from '../user/entities/user.entity';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { Issue } from './entities/issue.entity';

@Injectable()
export class IssueService {

  constructor(
    @InjectRepository(Issue) private readonly issueRepository: Repository<Issue>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly projectService: ProjectService
  ) { }

  async create(createIssueDto: CreateIssueDto, user: User) {
    try {
      const { issueTitle, projectId, userAssignedTo, ...rest } = createIssueDto;

      // Check if the project exists and user has required update right on the project
      const project = await this.projectService.manageProjectIssues(projectId, user)

      // Check if there is an Issue with similar title on the project
      if (project.projectIssues.some(issue => issue.issueTitle === issueTitle))
        throw new ConflictException(`Issue with title: '${issueTitle}' already exists on ${project.projectName} project`);

      // Check if User to assign the issue to is a member of the project
      if (!project.members.some(member => member.userId === userAssignedTo))
        throw new ConflictException(`Cannot assign issue to User with ID: ${userAssignedTo}, user not a member of this project`);

      // Prepare New Issue Object and Save
      const issueToOpen = new Issue();
      issueToOpen.issueTitle = issueTitle;
      issueToOpen.description = rest.description;
      issueToOpen.issueType = rest.issueType;
      issueToOpen.issuePriority = rest.issuePriority;
      issueToOpen.issueStatus = rest.issueStatus;
      issueToOpen.dueDate = rest.dueDate;
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

  async reassignIssue() {}

  findAll() {
    return `This action returns all issue`;
  }

  findOne(id: number) {
    return `This action returns a #${id} issue`;
  }

  update(id: number, updateIssueDto: UpdateIssueDto) {
    return `This action updates a #${id} issue`;
  }

  remove(id: number) {
    return `This action removes a #${id} issue`;
  }
}
