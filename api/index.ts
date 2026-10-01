import express from 'express';
import { coachRouter } from '../src/server/coachRouter';

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(coachRouter);

export default app;
