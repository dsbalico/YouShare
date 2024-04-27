import pino, { Logger } from 'pino';

let logger: Logger;

if (process.env.NODE_ENV === 'production') {
    logger = pino(); // Use pino with default JSON formatting for production
} else {
    logger = pino({
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: true,
            },
        },
        base: null,
        timestamp: false,
    });
}

export default logger;
