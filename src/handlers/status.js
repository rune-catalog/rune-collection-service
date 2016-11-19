'use strict';

module.exports = function statusGetHandler(req, res, next) {
  res.send(200);
  next();
}
