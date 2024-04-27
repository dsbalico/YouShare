import { NextFunction, Request, Response } from "express";

function adminOnly(
    req: Request, 
    res: Response,
    next: NextFunction
) {
    const userRole = res.locals.user.userData.role;

    if (userRole === "admin") return next();

    return res.sendStatus(401);
}

export default adminOnly;

