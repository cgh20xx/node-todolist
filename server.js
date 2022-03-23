const http = require('http'); // node 內建模組
const { v4: uuidv4 } = require('uuid'); // 第三方模組
const headers = require('./headers'); // 自己寫的 headers 模組
const errHandler = require('./errHandler'); // 自己寫的 errHandler 模組
const todos = [];

const requestListener = (req, res) => {
  // Node.js 官網接收 buffer 教學 https://nodejs.org/api/stream.html#api-for-stream-consumers
  // Node.js 開發者社群 - 各種原生與套件，接收 req.body 的方式 https://nodejs.dev/learn/get-http-request-body-data-using-nodejs

  // 接收 request body 資料。 chunk 為 Buffer 物件
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });

  // Node.js V10 的新寫法
  // const buffers = [];
  // for await (const chunk of req) {
  //   buffers.push(chunk);
  // }
  // const data = Buffer.concat(buffers).toString();
  // console.log('data:', data);
  // console.log(req.url);

  if (req.url === '/todos' && req.method === 'GET') {
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        status: 'success',
        data: todos,
      })
    );
    res.end();
  } else if (req.url === '/todos' && req.method === 'POST') {
    // 因 POST 要接收使用者傳的 body 資料，所以要偵聽 end event
    req.on('end', () => {
      try {
        // 接受別人傳入的資料一定要 try catch
        const title = JSON.parse(body).title;
        // 多判斷 title 是否為字串
        if (title !== undefined && typeof title === 'string') {
          const todo = {
            id: uuidv4(),
            title: title,
          };
          todos.push(todo);
          res.writeHead(200, headers);
          res.write(
            JSON.stringify({
              status: 'success',
              data: todos,
            })
          );
          res.end();
        } else {
          errHandler(res);
        }
      } catch (err) {
        errHandler(res);
      }
    });
  } else if (req.url === '/todos' && req.method === 'DELETE') {
    todos.length = 0;
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        status: 'success',
        data: todos,
      })
    );
    res.end();
  } else if (req.url.startsWith('/todos/') && req.method === 'DELETE') {
    // 先取得 id
    const id = req.url.split('/').pop();
    // 檢查 todos 有無該筆 id 資料，有才能刪除，沒有則回應錯誤
    const index = todos.findIndex((todo) => todo.id === id);
    if (index !== -1) {
      // 刪除該筆資料
      todos.splice(index, 1);
      res.writeHead(200, headers);
      res.write(
        JSON.stringify({
          status: 'success',
          data: todos,
        })
      );
      res.end();
    } else {
      errHandler(res);
    }
  } else if (req.url.startsWith('/todos/') && req.method === 'PATCH') {
    // 因 PATCH 要接收使用者傳的 body 資料，所以要偵聽 end event
    req.on('end', () => {
      try {
        // 接受別人傳入的資料一定要 try catch
        const title = JSON.parse(body).title;
        const id = req.url.split('/').pop();
        // 檢查 todos 有無該筆 id 資料，有才能更新，沒有則回應錯誤
        const index = todos.findIndex((todo) => todo.id === id);
        // 多判斷 title 是否為字串
        if (title !== undefined && typeof title === 'string' && index !== -1) {
          todos[index].title = title;
          res.writeHead(200, headers);
          res.write(
            JSON.stringify({
              status: 'success',
              data: todos,
            })
          );
          res.end();
        } else {
          errHandler(res);
        }
      } catch (err) {
        errHandler(res);
      }
    });
  } else if (req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.write('options');
    res.end();
  } else {
    res.writeHead(404, headers);
    res.write(
      JSON.stringify({
        status: 'false',
        mess: 'page not found',
      })
    );
    res.end();
  }
};

const server = http.createServer(requestListener);
server.listen(process.env.PORT || 8080);

// precess.env.PORT 為 heroku 環境的 PORT，本機不會有
// package.json 也要設定 "engines": { "node": "16.x"} 因 heroku 會依此設定使用 node 版本
