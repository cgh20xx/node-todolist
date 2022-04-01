const responseHandler = require('./response-handler');
const resType = require('./response-type');

function getTodo(req, res) {
  responseHandler(res, resType.SUCCESS);
}
module.exports = getTodo;
