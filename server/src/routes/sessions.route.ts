import { Router } from 'express';
import * as SessionsController from '../controllers/sessions.controller';
import requireUser from '../middlewares/requireUser';

const sessionsRoute: Router = Router();

sessionsRoute.post('/', SessionsController.createSession);

sessionsRoute.get('/', requireUser, SessionsController.getCurrentSession);

sessionsRoute.delete('/', requireUser, SessionsController.deleteSession);

export default sessionsRoute;