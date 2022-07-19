import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../common/entities/abstract.entity';
import { ProjectAccess } from './project-access.entity';
import { ProjectPriority, ProjectStatus } from '../interfaces/project.interface';
import { Issue } from '../../issue/entities/issue.entity';

@Entity()
export class Project extends AbstractEntity {

    @Column('varchar', { nullable: false, length: 255 })
    projectName: string;

    @Column('varchar', { nullable: false, length: 255 })
    description: string;

    @Column('enum', { enum: ProjectStatus, default: ProjectStatus.PROPOSED })
    projectStatus: ProjectStatus;

    @Column('enum', { enum: ProjectPriority, default: ProjectPriority.MEDIUM })
    projectPriority: ProjectPriority

    @OneToMany(() => ProjectAccess, projectAccess => projectAccess.project)
    members: ProjectAccess[];

    @OneToMany(() => Issue, issue => issue.project)
    projectIssues: Issue[]

}
