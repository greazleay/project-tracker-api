import {
  Injectable,
  ConflictException,
  NotFoundException,
  HttpException,
  UnauthorizedException,
  HttpStatus,
  ForbiddenException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user.dto';
import { ResetPasswordDto } from './dto/common-user.dto';
import { EmailService } from '../services/email/email.service';
import { SendMailOptions } from '../services/email/interfaces/email.interface';
import { getVerificationEmailTemplate } from '../services/email/templates/verificationCode';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly emailService: EmailService
  ) { }

  async findAll(query: PaginateQuery): Promise<Paginated<User>> {
    try {

      return await paginate(query, this.usersRepository, {
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

  async findOneByEmail(email: string): Promise<User> {
    try {
      const foundUser = await this.usersRepository.findOneBy({ email });

      if (foundUser) return foundUser;

      throw new UnauthorizedException('Invalid Credentials');
    } catch (error) {
      console.error(error)
      throw new HttpException(
        error.message ?? 'SOMETHING WENT WRONG',
        error.status ?? HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  };

  async findOneById(id: string): Promise<Partial<User>> {
    try {
      const foundUser = await this.usersRepository.findOneBy({ id });

      if (foundUser) {

        const { refreshToken, resetPassword, password, personalKey, ...data } = foundUser;
        return data;

      };

      throw new NotFoundException(`User with id: ${id} does not exist on this server`);

    } catch (error) {
      console.error(error)
      throw new HttpException(
        error.message ?? 'SOMETHING WENT WRONG',
        error.status ?? HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  };

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {

      const isUserExist = await this.usersRepository.findOneBy({ email: createUserDto.email })
      if (isUserExist) throw new ConflictException(`User with ${createUserDto.email} already exists`);

      const newUser = this.usersRepository.create(createUserDto);
      await this.usersRepository.save(newUser);

      return newUser;

    } catch (error) {
      console.error(error)
      throw new HttpException(
        error.message ?? 'SOMETHING WENT WRONG',
        error.status ?? HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  };

  async getVerificationCode(email: string): Promise<{ status: string, message: string }> {
    try {

      const foundUser = await this.usersRepository.findOneBy({ email });

      if (foundUser) {

        const code = await foundUser.generatePasswordResetCode()

        const mailOptions: SendMailOptions = [
          email,
          'Verification code',
          `Your verification code is ${code}`,
          getVerificationEmailTemplate(foundUser.firstName, foundUser.lastName, code)
        ];

        await this.emailService.sendEmail(...mailOptions)

        return {
          status: 'SUCCESS',
          message: `Verification Code Sent to ${email}`
        };

      }

      throw new NotFoundException(`User with email: ${email} not found on this server`);

    } catch (error) {
      console.error(error)
      throw new HttpException(
        error.message ?? 'SOMETHING WENT WRONG',
        error.status ?? HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ status: string, message: string }> {
    try {

      const { email, code, password } = resetPasswordDto;

      const foundUser = await this.usersRepository.findOneBy({ email });

      if (foundUser && await foundUser.verifyPasswordResetCode(code)) {

        foundUser.password = await foundUser.hashPasswordBeforeUpdate(password)
        await this.usersRepository.save(foundUser);

        return { status: 'SUCCESS', message: 'Password Reset Successful' };
      }

      throw new ForbiddenException('Verification code is invalid or it has expired')

    } catch (error) {
      console.error(error)
      throw new HttpException(
        error.message ?? 'SOMETHING WENT WRONG',
        error.status ?? HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async changePassword(id: string, changePasswordDto: UpdateUserPasswordDto): Promise<{ status: string, message: string }> {
    try {

      const foundUser = await this.usersRepository.findOneBy({ id })

      if (foundUser) {

        const { password } = changePasswordDto;

        foundUser.password = await foundUser.hashPasswordBeforeUpdate(password)

        await this.usersRepository.save(foundUser);

        return { status: 'SUCCESS', message: 'Password Change Successful' };
      }

      throw new NotFoundException(`User with ${id} not found on this server`)

    } catch (error) {
      console.error(error)
      throw new HttpException(
        error.message ?? 'SOMETHING WENT WRONG',
        error.status ?? HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async delete(id: string) {

    try {
      await this.usersRepository.delete(id);
      return { statusCode: 200, message: 'User deleted' };
    } catch (error) {
      console.error(error)
      throw new HttpException(
        error.message ?? 'SOMETHING WENT WRONG',
        error.status ?? HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
