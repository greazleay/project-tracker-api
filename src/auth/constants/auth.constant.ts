import { CookieOptions } from "express";

export const cookieOptions: CookieOptions = {
    domain: 'polldevs.com',
    path: '/v1/auth/refresh_token',
    httpOnly: true,
    maxAge: 604800000,
    signed: true,
    sameSite: 'strict',
    secure: true,
};