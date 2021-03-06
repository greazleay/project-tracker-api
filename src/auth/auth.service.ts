import { BadRequestException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { ITokens } from './interfaces/auth.interface';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private jwtService: JwtService,
        private readonly configService: ConfigService,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
    ) { }

    async validateUser(email: string, pass: string): Promise<User> {
        try {
            const user = await this.usersService.findOneByEmail(email);
            if (user && await user.isPasswordValid(pass)) {
                user.lastLogin = new Date();
                await this.userRepository.save(user);
                return user;
            };
            throw new UnauthorizedException('Invalid Credentials');
        } catch (error) {
            console.error(error);
            throw new HttpException(
                error.message ?? 'SOMETHING WENT WRONG',
                error.status ?? HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    };

    async validateJwt(sub: string): Promise<Partial<User>> {
        try {
            const user = await this.userRepository.findOneBy({ id: sub });
            if (user) {
                const { refreshToken, resetPassword, ...data } = user;
                return data;
            }
            throw new UnauthorizedException('Invalid Credentials');
        } catch (error) {
            console.error(error);
            throw new HttpException(
                error.message ?? 'SOMETHING WENT WRONG',
                error.status ?? HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async login(user: User): Promise<ITokens> {
        try {
            const personalKey = await user.generatePersonalKey();
            const payload = {
                sub: user.id,
                email: user.email,
                name: user.firstName + ' ' + user.lastName,
                lastLogin: user.lastLogin,
                roles: user.roles,
                isActive: user.isActive,
                rtk: personalKey,
            };

            const token = this.jwtService.sign(payload);
            const refreshToken = sign(
                payload,
                {
                    key: this.configService.get<string>('REFRESH_TOKEN_PRIVATE_KEY'),
                    passphrase: this.configService.get<string>('REFRESH_TOKEN_SECRET')
                },
                {
                    algorithm: 'RS256',
                    expiresIn: '7d'
                }
            );
            await user.updateRefreshToken(personalKey, refreshToken);
            return { token, refreshToken };
        } catch (error) {
            console.error(error);
            throw new HttpException(
                error.message ?? 'SOMETHING WENT WRONG',
                error.status ?? HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async logout(user: User): Promise<void> {
        try {
            const logOutUser = await this.userRepository.findOneBy({ id: user.id });
            const personalKey = await logOutUser.generatePersonalKey();
            await this.userRepository.save(user);
        } catch (error) {
            console.error(error);
            throw new HttpException(
                error.message ?? 'SOMETHING WENT WRONG',
                error.status ?? HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async validateRefreshToken(token: string): Promise<ITokens> {
        try {
            if (!token) throw new BadRequestException('Refresh Token cannot be empty');
            const decoded = verify(token, this.configService.get<string>('REFRESH_TOKEN_PUBLIC_KEY')) as JwtPayload;
            const user = await this.userRepository.findOneBy({ id: decoded.sub });
            if (user && user.validatePersonalKey(decoded.rtk)) {
                return await this.login(user);
            };
            throw new UnauthorizedException('Invalid Refresh Token, Please initiate a new login request');
        } catch (error) {
            console.error(error);
            throw new HttpException(
                error.message ?? 'SOMETHING WENT WRONG',
                error.status ?? HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }
}
