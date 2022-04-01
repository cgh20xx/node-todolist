const responseHandler = require('./response-handler');
const resType = require('./response-type');
const todos = require('./todos');

function deleteTodo(req, res, { id } = {}) {
  if (id === undefined) {
    // 沒有傳入 id 刪除全部 todo
    todos.length = 0;
    responseHandler(res, resType.SUCCESS);
  } else {
    // 有傳入 id 刪除單筆 todo
    // 檢查 todos 有無該筆 id 資料，有才能刪除，沒有則回應錯誤
    const index = todos.findIndex((todo) => todo.id === id);
    if (index !== -1) {
      // 刪除該筆資料
      todos.splice(index, 1);
      responseHandler(res, resType.SUCCESS);
    } else {
      responseHandler(res, resType.ERROR);
    }
  }
}
module.exports = deleteTodo;
