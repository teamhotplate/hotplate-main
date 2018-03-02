import apiRouter from './api';
import authRouter from './auth';
import clientRouter from './client';

export default {
    api: apiRouter,
    auth: authRouter,
    client: clientRouter
};