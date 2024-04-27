import { Request, Response } from "express";
import config from "config";

import Session from "../models/session.model";
import User from "../models/user.model";

import { validateUser } from "../services/sessions.service";

import { signJWT } from "../utilities/jwt";
import setCookie from "../utilities/setCookie";

async function createSession(req: Request, res: Response): Promise<Response> {
    try {
        const user: User = await validateUser(req.body);

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
        
        return res.status(201).json({
            status: 'success',
            message: 'Logged in successfully.',
            data: {
                accessToken,
                refreshToken,
                user,
            }
        });
    }
    catch (error: any) {
        return res.status(500).json({ status: 'failed', message: error.message });
    }
}

async function getCurrentSession(_req: Request, res: Response): Promise<Response> {
    try {
        const sessionData: Session = res.locals.user.sessionData;
        
        if (!sessionData) 
            return res.status(404).json({status: 'failed', message: 'Session not found.'});

        const user: User | null = await User.findByPk(sessionData.userId);
        
        if (!user) 
            return res.status(404).json({status: 'failed', message: 'User in session not found.'});
        
        return res.status(200).json({ status: 'success', message: "User in session retrieved successfully" , data: user });
    }
    catch (error: any) {
        return res.status(500).json({ status: 'failed', message: error.message });
    }
}

async function deleteSession(_req: Request, res: Response): Promise<Response> {
    try {
        const id: string = res.locals.user.sessionData.id;
        
        const destroyedSession = await Session.destroy({ where: { id } });

        if(destroyedSession < 1)
            return res.status(404).json({ status: 'failed', message: 'Session to delete not found.'});

        res.clearCookie('accessToken');
		res.clearCookie('refreshToken');

        return res.status(200).json({ status: 'success', message: 'Session deleted successfully.'});
    }
    catch (error: any) {
        return res.status(500).json({ status: 'failed', message: error.message });
    }
}

export { createSession, deleteSession, getCurrentSession };

