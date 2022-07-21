import { Controller, HttpCode, Post, UseGuards, Req, Res } from '@nestjs/common';
import {
    ApiBasicAuth,
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiCookieAuth,
    ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { FastifyRequest, FastifyReply } from 'fastify';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { UserDecorator } from '../user/decorators/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { cookieOptions } from './constants/auth.constant';
import { LoginUserDto } from './dto/login-user.dto';
import { SkipAuth } from './decorators/skip-auth.decorator';


@Controller({
    path: 'auth',
    version: '1'
})
@ApiTags('Auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @ApiBasicAuth()
    @ApiBody({ type: LoginUserDto })
    @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
    @ApiOperation({
        description: 'Logs in a User with valid email/password combinations'
    })
    @ApiOkResponse({
        description: 'Successful Login'
    })
    @ApiUnauthorizedResponse({
        description: 'Login Attempt failed due to invalid email/password combination'
    })
    @ApiInternalServerErrorResponse({
        description: 'An Internal Server Error occured while processing the request'
    })
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
    };

    @Post('logout')
    @HttpCode(200)
    @ApiBearerAuth()
    @ApiOperation({
        description: 'Logs out a user and clears refresh token cookies'
    })
    @ApiOkResponse({
        description: 'Logout successful'
    })
    @ApiUnauthorizedResponse({
        description: 'Access Token supplied with the request has expired'
    })
    @ApiInternalServerErrorResponse({
        description: 'An Internal Server Error occured while processing the request'
    })
    async logout(@UserDecorator() user: User, @Res({ passthrough: true }) res: FastifyReply) {
        await this.authService.logout(user);
        res.clearCookie('jit', cookieOptions);
        return { message: 'Logout Successful' };
    };

    @Post('refresh-token')
    @SkipAuth()
    @HttpCode(200)
    @ApiCookieAuth()
    @ApiOperation({
        description: 'Gets a new Token with a valid refresh token'
    })
    @ApiOkResponse({
        description: 'Token Refresh successful'
    })
    @ApiUnauthorizedResponse({
        description: 'Refresh Token supplied with the request has expired'
    })
    @ApiInternalServerErrorResponse({
        description: 'An Internal Server Error occured while processing the request'
    })
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
    };
}
