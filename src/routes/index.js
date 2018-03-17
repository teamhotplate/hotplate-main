import apiRouter from './api';
import authRouter from './auth';
import bundleRouter from './bundles';
import clientRouter from './client';
import projectsRouter from './projects';

export default {
    api: apiRouter,
    auth: authRouter,
    bundles: bundleRouter,
    client: clientRouter,
    projects: projectsRouter
};