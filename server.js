const http = require('http'); // node 內建模組
const getTodo = require('./get-todo');
const postTodo = require('./post-todo');
const deleteTodo = require('./delete-todo');
const patchTodo = require('./patch-todo');
const responseHandler = require('./response-handler');
const resType = require('./response-type');

const requestListener = (req, res) => {
  // Node.js 官網接收 buffer 教學 https://nodejs.org/api/stream.html#api-for-stream-consumers
  // Node.js 開發者社群 - 各種原生與套件，接收 req.body 的方式 https://nodejs.dev/learn/get-http-request-body-data-using-nodejs
  // 接收 request body 資料。 chunk 為 Buffer 物件
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });
  if (req.url === '/todos' && req.method === 'GET') {
    // 取得所有資料
    getTodo(req, res);
  } else if (req.url === '/todos' && req.method === 'POST') {
    // 新增單筆資料
    req.on('end', () => {
      // 因 POST 要接收使用者傳的 body 資料，所以要偵聽 end event
      postTodo(req, res, { body: body });
    });
  } else if (req.url === '/todos' && req.method === 'DELETE') {
    // 刪除所有資料
    deleteTodo(req, res);
  } else if (req.url.startsWith('/todos/') && req.method === 'DELETE') {
    // 刪除單筆資料
    const id = req.url.split('/').pop();
    deleteTodo(req, res, { id: id });
  } else if (req.url.startsWith('/todos/') && req.method === 'PATCH') {
    // 更新單筆資料
    req.on('end', () => {
      // 因 PATCH 要接收使用者傳的 body 資料，所以要偵聽 end event
      patchTodo(req, res, { body: body });
    });
  } else if (req.method === 'OPTIONS') {
    responseHandler(req, resType.OPTIONS);
  } else {
    // 找不到路由
    responseHandler(req, resType.PAGE_NOT_FOUND);
  }
};

const server = http.createServer(requestListener);
server.listen(process.env.PORT || 8080);
// heroku node.js 設定參考：https://devcenter.heroku.com/articles/deploying-nodejs#specify-the-version-of-node
// precess.env.PORT 為 heroku 環境的 PORT，本機不會有
// package.json 也要設定 "engines": { "node": "16.x"} 因 heroku 會依此設定使用 node 版本
