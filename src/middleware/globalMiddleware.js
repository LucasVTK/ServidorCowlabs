const globalMiddleware = {
  cors(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // responde logo ao preflight OPTIONS
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  }
};

export default globalMiddleware;
