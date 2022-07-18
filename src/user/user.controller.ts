import { Controller, Get, Post, Put, Body, Param, Delete, UseGuards, HttpCode } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiProduces } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserDecorator } from './decorators/user.decorator';
import { Role } from './interfaces/user.interface';
import { ResetPasswordDto, ValidEmailDto } from './dto/common-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user.dto';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('User')
@Controller('v1/users')
export class UserController {
    constructor(private readonly usersService: UserService) { }

    @Post('register')
    @ApiConsumes('multipart/form-data')
    @ApiProduces('application/json')
    @SkipAuth()
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Get('userinfo')
    @ApiBearerAuth()
    @Roles(Role.ADMIN)
    findOne(@UserDecorator('id') id: string) {
        return this.usersService.findOneById(id);
    }

    @Get('get-verification-code/:email')
    async getVerificationCode(@Param() params: ValidEmailDto) {
        const { email } = params;
        return this.usersService.getVerificationCode(email);
    }

    @Put('reset-password')
    @HttpCode(204)
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return this.usersService.resetPassword(resetPasswordDto);
    }

    @Put('change-password')
    @ApiBearerAuth()
    @HttpCode(204)
    @UseGuards(JwtAuthGuard)
    async changePassword(@UserDecorator('id') id: string, @Body() changePasswordDto: UpdateUserPasswordDto) {
        return this.usersService.changePassword(id, changePasswordDto)
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usersService.delete(id);
    }

}