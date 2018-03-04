import apiRouter from './api';
import authRouter from './auth';
import clientRouter from './client';
import projectsRouter from './projects';

export default {
    api: apiRouter,
    auth: authRouter,
    client: clientRouter,
    projects: projectsRouter
};