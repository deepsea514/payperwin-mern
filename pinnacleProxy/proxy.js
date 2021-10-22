var http = require('http'),
  httpProxy = require('http-proxy');
var options = {
  target: 'http://api.pinnacle.com',
  changeOrigin: true,
  followRedirects: true,
  headers: {
    Authorization: 'Basic SkIxMDUyNzIyOlF3ZXJ0eTg4OA==', // see: https://github.com/pinnacleapi/pinnacleapi-documentation
    Accept: 'application/json',
  },
}

var whitelist = [
  '70.93.128.177',
  '67.169.136.247',
  '192.99.250.2',
];
var proxy = httpProxy.createProxyServer({});
var server = http.createServer((req, res) => {
  const ip = req.connection.remoteAddress.replace('::ffff:', '');
  const access = whitelist.indexOf(ip) > -1;
  if (req.url !== '/') {
    console.log(ip, req.url, access ? 'access granted' : 'access denied');
  }
  if (access) {
    proxy.web(req, res, options);
  } else {
    res.writeHead(403);
    res.end(`Access Denied. Ask webmaster to have your ip -> (${ip}) whitelisted for this PAYPERWIN API proxy.`);
  }
});
server.listen(80);
