import config from 'config';
import jwt from 'jsonwebtoken';

function signJWT(
    object: Object, 
    keyName:  "accessTokenPrivateKey" | "refreshTokenPrivateKey",
    options?: jwt.SignOptions | undefined,
) {
    const signKey = Buffer.from(
        config.get<string>(keyName), "base64"
    ).toString("ascii");

    return jwt.sign(object, signKey, {
        ...(options && options),
        algorithm: "RS256",
    });
}

function verifyJWT(
    token: string, 
    keyName: "accessTokenPublicKey" | "refreshTokenPublicKey"
) {
    const publicKey = Buffer.from(
        config.get<string>(keyName), "base64")
        .toString("ascii");

    try {
        const decoded = jwt.verify(token, publicKey);

        return { valid: true, expired: false, decoded };
    } catch (error: any) {
        return { valid: false, expired: error.message === "jwt expired", decoded: null };
    }
}

export { signJWT, verifyJWT }