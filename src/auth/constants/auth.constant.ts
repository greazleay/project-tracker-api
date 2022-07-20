import { CookieSerializeOptions } from '@fastify/cookie';

export const cookieOptions: CookieSerializeOptions = {
    domain: 'localhost',    // Value must be set to FE domain for cookie to be sent
    httpOnly: true,
    maxAge: 604800000,
    path: '/v1/auth/refresh-token',
    sameSite: 'strict',
    secure: true,
    signed: true,
};