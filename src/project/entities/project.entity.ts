import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { AbstractEntity } from '../../common/entities/abstract.entity';
import { User } from '../../user/entities/user.entity';
import { ProjectAccess } from '../interfaces/project.interface';

@Entity()
export class Project extends AbstractEntity {

    @Column('varchar', { nullable: false, length: 255 })
    projectName: string;

    @Column('varchar', { nullable: false, length: 255 })
    description: string;

    @ManyToMany(() => User, user => user.projects)
    @JoinTable()
    members: User[];

}
