import { Entity, Column, BeforeInsert, OneToMany, ManyToMany } from 'typeorm';
import { compare, hash } from 'bcrypt';
import { randomBytes } from 'crypto';
import { Exclude } from 'class-transformer';
import { AbstractEntity } from '../../common/entities/abstract.entity';
import { Project } from '../../project/entities/project.entity';
import { IResetPassword, Role } from '../interfaces/user.interface';
import { ProjectAccess } from '../../project/entities/project-access.entity';


@Entity()
export class User extends AbstractEntity {

    @Column('varchar', {
        length: 255,
        nullable: false,
        unique: true
    })
    email: string;

    @Exclude()
    @Column('varchar', {
        length: 255,
        nullable: false
    })
    password: string;

    @Column('varchar')
    firstName: string;

    @Column('varchar')
    lastName: string;

    @Column({ nullable: true })
    avatar: string;

    @Column('timestamp without time zone', { nullable: true })
    lastLogin: Date;

    @Column({ default: true })
    isActive: boolean;

    @Column('enum', {
        enum: Role,
        default: [Role.USER],
        array: true,
    })
    roles: Role[];

    @Column('jsonb', { nullable: true, default: {} })
    resetPassword: IResetPassword;

    @Column('varchar', { nullable: true })
    refreshToken: string;

    @Column('varchar', { nullable: true })
    personalKey: string;

    @OneToMany(() => ProjectAccess, projectAccess => projectAccess.user)
    projects: ProjectAccess[]

    @BeforeInsert()
    async hashPassword() {
        this.password = await hash(this.password, 10);
    }

    async hashPasswordBeforeUpdate(password: string) {
        return await hash(password, 10);
    }

    public async isPasswordValid(password: string): Promise<boolean> {
        return await compare(password, this.password);
    }

    public async updateRefreshToken(personalKey: string, refreshToken: string): Promise<void> {
        this.personalKey = personalKey;
        this.refreshToken = refreshToken;
        await this.save();
    }

    public async generatePersonalKey(): Promise<string> {
        return randomBytes(32).toString('hex');
    }

    public async validatePersonalKey(personalKey: string): Promise<boolean> {
        return this.personalKey === personalKey;
    }

    public async generatePasswordResetCode(): Promise<string> {
        const code = randomBytes(3).toString('hex').toUpperCase();
        this.resetPassword.code = await hash(code, 10);
        this.resetPassword.expiresBy = new Date(Date.now() + 300000);
        this.save();
        return code;
    }

    public async verifyPasswordResetCode(code: string): Promise<boolean> {
        const validCode = await compare(code, this.resetPassword.code);
        const codeNotExpired = (Date.now() - new Date(this.resetPassword.expiresBy).getTime()) < 300000;
        return validCode && codeNotExpired;
    }
}
