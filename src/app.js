import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

app.get('/status', (_req, res) => res.json({ ok: true }));

export default app;
