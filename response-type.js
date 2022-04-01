const todos = require('./todos');

module.exports = {
  SUCCESS: {
    code: 200,
    writeDatas: {
      status: 'Success.',
      message: todos,
    },
  },
  ERROR: {
    code: 400,
    writeDatas: {
      status: 'fail',
      message: 'Invalid path or id.',
    },
  },
  OPTIONS: {
    code: 404,
    writeDatas: null,
  },
  PAGE_NOT_FOUND: {
    code: 404,
    writeDatas: {
      status: 'fail',
      message: 'Page not found.',
    },
  },
};
