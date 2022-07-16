import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ValidEmailDto {
    @ApiProperty()
    @IsEmail()
    email: string;
}

export class ResetPasswordDto {
    @ApiProperty()
    @IsEmail()
    email: string

    @ApiProperty()
    @IsString()
    @MinLength(6, { message: 'Password must have at least six characters' })
    password: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    code: string;
}