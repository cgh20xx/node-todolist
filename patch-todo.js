const responseHandler = require('./response-handler');
const resType = require('./response-type');
const todos = require('./todos');

function patchTodo(req, res, { body }) {
  try {
    // 接受別人傳入的資料一定要 try catch
    const title = JSON.parse(body).title;
    const id = req.url.split('/').pop();
    // 檢查 todos 有無該筆 id 資料，有才能更新，沒有則回應錯誤
    const index = todos.findIndex((todo) => todo.id === id);
    // 多判斷 title 是否為字串
    if (title !== undefined && typeof title === 'string' && index !== -1) {
      todos[index].title = title;
      responseHandler(res, resType.SUCCESS);
    } else {
      responseHandler(res, resType.ERROR);
    }
  } catch (err) {
    responseHandler(res, resType.ERROR);
  }
}
module.exports = patchTodo;
