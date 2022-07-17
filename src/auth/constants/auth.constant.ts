import { CookieOptions } from "express";

export const cookieOptions: CookieOptions = {
    domain: 'localhost',    // Value must be set to FE domain for cookie to be sent
    path: '/v1/auth/refresh-token',
    httpOnly: true,
    maxAge: 604800000,
    signed: true,
    sameSite: 'strict',
    secure: true,
};