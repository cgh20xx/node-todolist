const headers = require('./headers');

function responseHandler(res, resType) {
  res.writeHead(resType.code, headers);
  if (resType.writeDatas) {
    res.write(JSON.stringify(resType.writeDatas));
  }
  res.end();
}

module.exports = responseHandler;
