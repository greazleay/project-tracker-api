import { IsAlphanumeric, IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {

    @ApiProperty()
    @IsNotEmpty()
    readonly firstName: string;

    @ApiProperty()
    @IsNotEmpty()
    readonly lastName: string;

    @ApiProperty()
    @IsEmail()
    readonly email: string;

    @ApiProperty()
    @IsAlphanumeric()
    @MinLength(6)
    readonly password: string;
}