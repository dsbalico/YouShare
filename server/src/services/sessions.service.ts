import config from "config";
import { get } from "lodash";

import User from "../models/user.model";

import { signJWT, verifyJWT } from "../utilities/jwt";
import Session from "../models/session.model";

function isValidUUID(uuid: string): boolean {
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidPattern.test(uuid);
}

async function validateUser({ credential, password }: { credential: string, password: string }) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let user = null;

    if (emailRegex.test(credential))
        user = await User.findOne({ where: { email: credential }});
    else if (isValidUUID(credential))
        user = await User.findOne({ where: { id: credential }});
    else
        user = await User.findOne({ where: { username: credential }});

    if (!user) throw new Error('The username/email or password you provided is incorrect.');

    if (user.googleId && user.password === null) throw new Error('This account uses google sign-in')

    const isPasswordValid: boolean = await user.comparePassword(password);

    if (!isPasswordValid) throw new Error('The username/email or password you provided is incorrect.');

    return user;
}

async function reIssueAccessToken(refreshToken: string): Promise<string | null>{
    const { decoded } = verifyJWT(refreshToken, "refreshTokenPublicKey");

    if (!decoded || !get(decoded, "sessionData.id")) return null;

    const session = await Session.findByPk(get(decoded, "sessionData.id"));

    if (!session) return null;

    const user = await User.findByPk(session.userId);

    if (!user) return null;

    const accessToken = signJWT(
        { ...user, session: session.id },
        "accessTokenPrivateKey",
        { expiresIn: config.get("accessTokenTtl") }
    );

    return accessToken;
}

export { validateUser, reIssueAccessToken };