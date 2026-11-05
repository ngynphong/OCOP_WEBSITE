// This standalone test server is launched directly by Node as CommonJS.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const http = require('node:http');
let current = 'refresh-0';
let requests = 0;
let replays = 0;

http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  if (req.url === '/health') return res.end(JSON.stringify({ ok: true }));
  if (req.url === '/stats') return res.end(JSON.stringify({ requests, replays, current }));
  if (req.url === '/reset' && req.method === 'POST') {
    current = 'refresh-0'; requests = 0; replays = 0;
    return res.end(JSON.stringify({ ok: true }));
  }
  if (req.url !== '/auth/refresh-token' || req.method !== 'POST') {
    res.writeHead(404); return res.end('{}');
  }
  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    const token = JSON.parse(body).refreshToken;
    requests++;
    if (token !== current) {
      replays++;
      res.writeHead(401); return res.end(JSON.stringify({ code: 1009 }));
    }
    current = `refresh-${requests}`;
    setTimeout(() => res.end(JSON.stringify({ code: 1000, data: {
      accessToken: `access-${requests}`, refreshToken: current, roles: ['USER'],
    } })), 300);
  });
}).listen(3217, '127.0.0.1');
