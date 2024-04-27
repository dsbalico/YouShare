import { Request, Response, NextFunction } from "express";
import { get } from "lodash";

import { verifyJWT } from "../utilities/jwt";
import setCookie from "../utilities/setCookie";

import { reIssueAccessToken } from "../services/sessions.service";

async function deserializeUser (
    req: Request,
    res: Response,
    next: NextFunction
) {
    const accessToken: string = get(req, "cookies.accessToken")
    const refreshToken: string = get(req, "cookies.refreshToken");

    if (!accessToken) return next();

    const { decoded, expired } = verifyJWT(accessToken, "accessTokenPublicKey");

    if (decoded) {
        res.locals.user = decoded;
        return next();
    }

    if (expired && refreshToken) {
        console.log("expired token");
        
        const newAccessToken: string | null = await reIssueAccessToken(refreshToken);

        if (!newAccessToken) return next();

        setCookie(res, "accessToken", newAccessToken);
        
        const result = verifyJWT(newAccessToken, "accessTokenPublicKey");
        res.locals.user = result.decoded;
        return next();
    }

    return next();
};

export default deserializeUser;