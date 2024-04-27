import { Response } from 'express';

import config from 'config';

function setCookie(
    res: Response, 
    cookieName: string, 
    cookieValue: string
) {
    return res.cookie(cookieName, cookieValue, {
        httpOnly: true,
        domain: 'localhost',
        path: '/',
        secure: false,
        sameSite: 'strict',
        maxAge: config.get("cookieTtl"),
    });
}

export default setCookie;