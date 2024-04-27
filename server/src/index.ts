import express, { Express } from 'express';
import config from 'config';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import passport from 'passport';

import registeredRoutes from './registeredRoutes';

import deserializeUser from './middlewares/deserializeUser';

import { testDbConnection } from './utilities/databaseConnection';
import logger from './utilities/logger';

import './services/google.service'

const port: Number = config.get('port');

const app: Express = express();

app.use(
    cors({ origin: true, credentials: true }),
    helmet(),
    express.json(),
    express.urlencoded({ extended: false }),
    cookieParser(),
    morgan('dev'),
    passport.initialize(),
    deserializeUser
)

registeredRoutes(app);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

async function startServer() {
    try {
        await testDbConnection();
    
        app.listen(port, () => {
            logger.info(`Server is running on http://localhost:${ port }`);
        });
    } catch (error: any) {
        logger.fatal(`Unable to start the server: ${ error.message }`);
    }
}

startServer();

module.exports = app;