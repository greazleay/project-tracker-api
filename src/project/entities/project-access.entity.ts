import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Project } from './project.entity';
import { User } from '../../user/entities/user.entity';
import { AccessType } from '../interfaces/project.interface';


@Entity()
export class ProjectAccess {
    @Exclude()
    @PrimaryGeneratedColumn('uuid')
    public ProjectAccessId!: string;

    @Column()
    public userId!: string;

    @Exclude()
    @Column()
    public projectId!: string;

    @Column('enum', { enum: AccessType, default: AccessType.VIEWER })
    accessType: AccessType;

    @CreateDateColumn()
    public dateAdded!: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    @DeleteDateColumn()
    public deletedAt: Date;

    @ManyToOne(() => User, (user) => user.projects, { onDelete: 'CASCADE' })
    public user!: User;

    @ManyToOne(() => Project, (project) => project.members, { onDelete: 'CASCADE' })
    public project!: Project;
}