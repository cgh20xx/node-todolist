const headers = require('./headers');

function errHandler(res) {
  res.writeHead(400, headers);
  res.write(
    JSON.stringify({
      status: 'false',
      message: '參數格式錯誤，或無此id',
    })
  );
  res.end();
}

module.exports = errHandler;