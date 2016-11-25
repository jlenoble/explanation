'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.error = exports.warn = exports.info = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _isString = require('is-string');

var _isString2 = _interopRequireDefault(_isString);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var lastTime = void 0;

var Explanation = function () {
  function Explanation(message, options) {
    _classCallCheck(this, Explanation);

    if (!lastTime) {
      lastTime = (0, _moment2.default)();
    }

    Object.assign(this, {
      leadingString: 'Info: ',
      messageStyle: _chalk2.default.green.underline.inverse,
      whenStyle: _chalk2.default.gray.inverse,
      explainStyle: _chalk2.default.dim,
      log: 'log'
    }, message, options);

    this.print();
  }

  _createClass(Explanation, [{
    key: 'print',
    value: function print() {
      if (!this.message) return;

      var log = this.log;

      var msg = this.leadingString + this.message;
      console[log]('\n' + this.messageStyle(msg));

      if (this.when) {
        msg = '⌚: ' + this.when;
        console.log(this.whenStyle(msg));
      }

      var explain = this.explain;
      var explainStyle = this.explainStyle;

      if (explain) {
        if (!Array.isArray(explain)) {
          explain = [explain];
        }
        for (var i = 0, max = explain.length; i < max; i += 1) {
          if (Array.isArray(explain[i])) {
            if (explain[i].length !== 2) {
              Explanation.error({
                message: 'Array error.explain[' + i + '] has not exactly 2 elements',
                explain: [['error.explain[' + i + '] is: ', explain[i]]]
              });
            }
            msg = explain[i][0];
            console.log(explainStyle(msg, JSON.stringify(explain[i][1])));
          } else {
            msg = explain[i];
            console.log(explainStyle((0, _isString2.default)(msg) ? msg : JSON.stringify(msg)));
          }
        }
      }

      if (this.a) {
        console.log(explainStyle('Calling Object/Function is ' + JSON.stringify(this.a)));
      }

      if (this.error) {
        throw this.error;
      }
    }
  }]);

  return Explanation;
}();

exports.default = Explanation;


var _formatMsg = function _formatMsg(msg) {
  var _msg = {};
  if (msg) {
    if (msg instanceof Error) {
      _msg.error = msg;
    }
    if ((0, _isString2.default)(msg.message)) {
      _msg.message = msg.message;
      _msg.explain = msg.explain;
      _msg.a = msg.a;
    } else if ((0, _isString2.default)(msg)) {
      _msg.message = msg;
    }
  }

  var now = (0, _moment2.default)();
  var diff = now - lastTime;
  if (!diff) {
    diff = 0;
  }
  lastTime = now;
  _msg.when = now.format('YYYY/MM/DD HH:mm:ss.SSS') + _chalk2.default.white('+' + diff + 'ms');

  return _msg;
};

var info = exports.info = function info(msg) {
  return new Explanation(_formatMsg(msg));
};

var warn = exports.warn = function warn(msg) {
  return new Explanation(_formatMsg(msg), {
    messageStyle: _chalk2.default.yellow.underline.inverse,
    leadingString: 'Warning: ',
    log: 'warn'
  });
};

var error = exports.error = function error(msg) {
  var _msg = _formatMsg(msg);
  var error = msg instanceof Error ? msg : new Error(_msg.message);
  return new Explanation(_msg, {
    messageStyle: _chalk2.default.red.underline.inverse,
    leadingString: 'Error: ',
    log: 'error',
    error: error
  });
};