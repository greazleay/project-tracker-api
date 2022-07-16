import { PartialType } from '@nestjs/mapped-types';
import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) { }

export class UpdateUserPasswordDto extends PickType(CreateUserDto, ['password'] as never) { }
