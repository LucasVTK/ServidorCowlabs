import serverless from 'serverless-http';
import app from '../src/app.js';

const handler = serverless(app);
export default (req, res) => handler(req, res);
