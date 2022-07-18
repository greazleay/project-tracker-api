import { Injectable } from '@nestjs/common';
import {
    Ability,
    AbilityBuilder,
    AbilityClass,
    ExtractSubjectType,
    InferSubjects
} from '@casl/ability';
import { User } from '../user/entities/user.entity';
import { Project } from '../project/entities/project.entity';
import { ProjectAccess } from '../project/entities/project-access.entity';
import { Action, AccessType } from '../project/interfaces/project.interface'
import { Role } from 'src/user/interfaces/user.interface';

type Subjects = InferSubjects<typeof Project | typeof User | typeof ProjectAccess> | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
    createForUser(user: User, project: Project) {
        const { can, cannot, build } = new AbilityBuilder<
            Ability<[Action, Subjects]>
        >(Ability as AbilityClass<AppAbility>);

        if (user.roles.includes(Role.SUPER_ADMIN)) can(Action.Manage, 'all')

        can(Action.Manage, ProjectAccess, { userId: user.id, projectId: project.id, accessType: AccessType.MANAGER })
        can(Action.Update, ProjectAccess, { userId: user.id, projectId: project.id, accessType: AccessType.COLLABORATOR });
        can(Action.Read, ProjectAccess, { userId: user.id, projectId: project.id, accessType: AccessType.VIEWER })
        cannot(Action.Delete, ProjectAccess, { userId: user.id, projectId: project.id, accessType: AccessType.COLLABORATOR });
        cannot(Action.Delete, ProjectAccess, { userId: user.id, projectId: project.id, accessType: AccessType.VIEWER });

        return build({
            // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
            detectSubjectType: (item) =>
                item.constructor as ExtractSubjectType<Subjects>,
        });
    }
}