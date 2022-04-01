const { v4: uuidv4 } = require('uuid'); // 第三方模組
const responseHandler = require('./response-handler');
const resType = require('./response-type');
const todos = require('./todos');

function postTodo(req, res, { body }) {
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
      responseHandler(res, resType.SUCCESS);
    } else {
      responseHandler(res, resType.ERROR);
    }
  } catch (err) {
    responseHandler(res, resType.ERROR);
  }
}
module.exports = postTodo;
