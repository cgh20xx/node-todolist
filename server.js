const http = require('http');
const { v4: uuidv4 } = require('uuid');
const todos = [];

const requestListener = async (req, res) => {
  const headers = {
    'Access-Control-Allow-Headers':
      'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET, OPTIONS, DELETE',
    'Content-Type': 'application/json',
  };

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
        } else {
          res.writeHead(400, headers);
          res.write(
            JSON.stringify({
              status: 'false',
              message: '參數格式錯誤',
            })
          );
          res.end();
        }

        res.end();
      } catch (err) {
        res.writeHead(400, headers);
        res.write(
          JSON.stringify({
            status: 'false',
            message: '參數格式錯誤',
          })
        );
        res.end();
      }
    });
  } else if (req.method === 'OPTIONS') {
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
server.listen(8080);
