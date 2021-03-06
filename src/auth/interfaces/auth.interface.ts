import { FastifyRequest } from 'fastify';
import { User } from '../../user/entities/user.entity';

export interface RequestWithUser extends FastifyRequest {
    user: User;
}

export interface ITokens {
    token: string;
    refreshToken: string
}