import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import http from 'http';
import logger from './logger';
import oneSampleTestRoutes from "./oneSampleTestRoutes";

async function startServer() {
    try {
        const app = express();

        const corsOrigin = process.env.API_CORS_ORIGIN || '*';
        app.use(cors({ origin: corsOrigin }));

        const morganFormat = ":remote-addr - :remote-user \":method :url HTTP/:http-version\" :status :res[content-length] \":referrer\" \":user-agent\"";
        app.use(morgan(morganFormat, {
            stream: {
                write: message => logger.info(message.trim())
            },
        }));

        app.use(express.json());

        app.use("/oneSampleTest", oneSampleTestRoutes);

        const port = parseInt(process.env.API_PORT) || 3000;
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