import { Controller, HttpCode, Post, UseGuards, Req, Res } from '@nestjs/common';
import { ApiBasicAuth, ApiBearerAuth, ApiBody, ApiConsumes, ApiCookieAuth, ApiProduces, ApiTags } from '@nestjs/swagger';
import { FastifyRequest, FastifyReply } from 'fastify';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { UserDecorator } from '../user/decorators/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { cookieOptions } from './constants/auth.constant';
import { LoginUserDto } from './dto/login-user.dto';
import { SkipAuth } from './decorators/skip-auth.decorator';


@ApiTags('Auth')
@Controller('/v1/auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @ApiBasicAuth()
    @ApiBody({ type: LoginUserDto })
    @ApiConsumes('application/x-www-form-urlencoded')
    @ApiProduces('application/json')
    @HttpCode(200)
    @SkipAuth()
    @UseGuards(LocalAuthGuard)
    async login(@UserDecorator() user: User, @Res({ passthrough: true }) res: FastifyReply) {
        const { token, refreshToken } = await this.authService.login(user);
        res.setCookie('jit', refreshToken, cookieOptions)
        return {
            statusCode: 200,
            message: 'Login Successful',
            authToken: token,
        };
    }

    @Post('logout')
    @ApiBearerAuth()
    @ApiProduces('application/json')
    @HttpCode(200)
    async logout(@UserDecorator() user: User, @Res({ passthrough: true }) res: FastifyReply) {
        await this.authService.logout(user);
        res.clearCookie('jit', cookieOptions);
        return { message: 'Logout Successful' };
    }

    @Post('refresh-token')
    @ApiCookieAuth()
    @ApiProduces('application/json')
    @SkipAuth()
    @HttpCode(200)
    async refreshToken(@Req() req: FastifyRequest, @Res({ passthrough: true }) res: FastifyReply) {
        const { jit } = req.cookies;
        const unsginedRefreshToken = jit ? req.unsignCookie(jit).value : '';        // Cookie needs to be unsigned else jwt would be malformed, issue specific to fastify
        const { token, refreshToken } = await this.authService.validateRefreshToken(unsginedRefreshToken);
        res.setCookie('jit', refreshToken, cookieOptions);
        return {
            statusCode: 200,
            message: 'Token Refresh Successful',
            authToken: token,
        };
    }
}
