import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginUserDto {
    @ApiProperty()
    @IsString()
    @IsEmail({ message: 'Please enter a valid email address' })
    readonly email: string;

    @ApiProperty()
    @IsString()
    @MinLength(6, { message: 'Password must be at least six characters long' })
    readonly password: string;
}