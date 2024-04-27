import { NextFunction, Request, Response } from 'express';

function requireUser(_req: Request, res: Response, next: NextFunction) {
	const user = res.locals.user;
    
	if (!user) return res.sendStatus(401);

	return next();
};

export default requireUser;
