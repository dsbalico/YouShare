import { Request, Response } from "express";
import config from 'config';

import Session from "../models/session.model";

import { signJWT } from "../utilities/jwt";
import User from "../models/user.model";
import setCookie from "../utilities/setCookie";

export async function handleCallback(req: Request, res: Response) {
    try {
        const user: any = req.user as User;

        if(Object.keys(user).length === 0) 
            return res.redirect(`${config.get('clientUrl')}/sign-in?error=emailError`);

        const userAgent = req.get('user-agent') || '';
        
        const session: Session = await Session.create({ userId: user.id, valid: true, userAgent: userAgent});

        const accessToken: string = signJWT(
            { userData: user, sessionData: session },
            "accessTokenPrivateKey",
            { expiresIn: config.get("accessTokenTtl") 
        });

        const refreshToken = signJWT(
            { userData: user, sessionData: session },
            "refreshTokenPrivateKey",
            { expiresIn: config.get("refreshTokenTtl") }
        );

        setCookie(res, 'accessToken', accessToken);
        setCookie(res, 'refreshToken', refreshToken);
        
        return res.redirect(`${config.get('clientUrl')}/feed`);
    }
    catch(error: any) {
        return res.redirect(`${config.get('clientUrl')}/sign-in?error=${error.message}`);
    }
}