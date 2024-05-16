import express from 'express';
import morgan from 'morgan';
import http from 'http';
import logger from './logger';

async function startServer() {
    try {
        const app = express();

        const morganFormat = ":remote-addr - :remote-user \":method :url HTTP/:http-version\" :status :res[content-length] \":referrer\" \":user-agent\"";
        app.use(morgan(morganFormat, {
            stream: {
                write: message => logger.info(message.trim())
            },
        }));

        app.use(express.json());

        const port = parseInt(process.env.PORT) || 3000;
        return app.listen(port, () => {
            logger.info(`Server is running on port ${port}`);
        });
    } catch (err) {
        throw err;
    }
}

async function shutdownServer() {
    logger.info('Attempting a graceful shutdown');
    server.close();
}

let server: http.Server;
startServer().then((result) => server = result);
process.on('SIGTERM', shutdownServer);
process.on('SIGINT', shutdownServer);