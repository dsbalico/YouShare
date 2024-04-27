import { Router } from 'express';
import passport from 'passport';

import * as GoogleController from '../controllers/google.controller'

const googleRoute: Router = Router();

googleRoute.get('/',
    passport.authenticate('google', { scope: [ 'email', 'profile' ] }
));

googleRoute.get('/callback',
    passport.authenticate( 'google', { session: false }), 
    GoogleController.handleCallback
);

export default googleRoute;