import { Sequelize } from 'sequelize-typescript'
import config from 'config'
import logger from './logger';

const sequelize: Sequelize = new Sequelize(
    config.get('databaseUrl'), 
    {   
        logging: false, 
        models: [__dirname + '/../models/**/*.model.ts'],
        define: {
            timestamps: true,
            paranoid: true
        }
    }
);

export async function testDbConnection(): Promise<void> {
    try {
        await sequelize.authenticate();
        logger.info('Database Connection has been established successfully.');
    } catch (error: any) {
        logger.fatal(`Unable to connect to the database: ${error.message}`);
    }
}

export default sequelize;