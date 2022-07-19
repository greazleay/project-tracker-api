import { Column, Entity, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../common/entities/abstract.entity';
import { Project } from '../../project/entities/project.entity';
import { User } from '../../user/entities/user.entity';
import { IssuePriority, IssueStatus, IssueType } from '../interfaces/issues.interface';

@Entity()
export class Issue extends AbstractEntity {

    @Column('varchar')
    issueTitle: string;

    @Column('varchar')
    description: string;

    @ManyToOne(() => Project, project => project.projectIssues)
    project: Project;

    @Column('enum', { enum: IssueType, default: IssueType.TECHNICAL })
    issueType: IssueType;

    @Column('enum', { enum: IssuePriority, default: IssuePriority.MEDIUM })
    issuePriority: IssuePriority;

    @Column('enum', { enum: IssueStatus, default: IssueStatus.OPEN })
    issueStatus: IssueStatus;

    @ManyToOne(() => User, user => user.openedIssues)
    openedBy: User;

    @Column('timestamp without time zone')
    dueDate: Date;

    @ManyToOne(() => User, user => user.closedIssues)
    closedBy: User

    @Column('timestamp without time zone', { nullable: true })
    dateClosed: Date;

    @Column('varchar', { nullable: true })
    resolutionSummary: string;
}
