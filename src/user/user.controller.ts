import { Controller, Get, Post, Put, Body, Param, Delete, Query, Patch } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiProduces } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDecorator } from './decorators/user.decorator';
import { Role } from './interfaces/user.interface';
import { ResetPasswordDto, ValidEmailDto } from './dto/common-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user.dto';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { PaginateQuery } from 'nestjs-paginate';

@ApiTags('User')
@Controller('v1/users')
export class UserController {
    
    constructor(private readonly usersService: UserService) { }

    @ApiConsumes('multipart/form-data')
    @ApiProduces('application/json')
    @Post('register')
    @SkipAuth()
    async create(@Body() createUserDto: CreateUserDto) {
        return await this.usersService.create(createUserDto);
    }

    @ApiBearerAuth()
    @ApiProduces('application/json')
    @Get('all')
    @Roles(Role.USER_ADMIN)
    async findAll(@Query() query: PaginateQuery) {
        return await this.usersService.findAll(query)
    }

    @ApiBearerAuth()
    @ApiProduces('application/json')
    @Get('userinfo')
    async findOne(@UserDecorator('id') id: string) {
        return await this.usersService.findOneById(id);
    }

    @ApiProduces('application/json')
    @Get('get-verification-code/:email')
    @SkipAuth()
    async getVerificationCode(@Param() params: ValidEmailDto) {
        const { email } = params;
        return await this.usersService.getVerificationCode(email);
    }

    @ApiProduces('application/json')
    @Put('reset-password')
    @SkipAuth()
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return await this.usersService.resetPassword(resetPasswordDto);
    }

    @ApiBearerAuth()
    @ApiProduces('application/json')
    @Patch('change-password')
    async changePassword(@UserDecorator('id') id: string, @Body() changePasswordDto: UpdateUserPasswordDto) {
        return await this.usersService.changePassword(id, changePasswordDto)
    }

    @ApiBearerAuth()
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return await this.usersService.delete(id);
    }

}