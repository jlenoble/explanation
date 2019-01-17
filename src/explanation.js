import moment from 'moment';
import isString from 'is-string';
import chalk from 'chalk';

let lastTime;

export default class Explanation {
  constructor (message, options) {
    if (!lastTime) {
      lastTime = moment();
    }

    Object.assign(this, {
      leadingString: 'Info: ',
      messageStyle: chalk.green.underline.inverse,
      whenStyle: chalk.gray.inverse,
      explainStyle: chalk.dim,
      log: 'log',
    }, message, options);

    this.print();
  }

  print () {
    if (!this.message) {
      return;
    }

    const log = this.log;

    let msg = this.leadingString + this.message;
    console[log]('\n' + this.messageStyle(msg));

    if (this.when) {
      msg = '⌚: ' + this.when;
      console.log(this.whenStyle(msg));
    }

    let explain = this.explain;
    const explainStyle = this.explainStyle;

    if (explain) {
      if (!Array.isArray(explain)) {
        explain = [explain];
      }
      for (let i = 0, max = explain.length; i < max; i += 1) {
        if (Array.isArray(explain[i])) {
          if (explain[i].length !== 2) {
            Explanation.error({
              message: 'Array error.explain[' + i +
                '] has not exactly 2 elements',
              explain: [
                ['error.explain[' + i + '] is: ', explain[i]],
              ],
            });
          }
          msg = explain[i][0];
          console.log(explainStyle(msg, JSON.stringify(explain[i][1])));
        } else {
          msg = explain[i];
          console.log(explainStyle(
            isString(msg) ? msg : JSON.stringify(msg)));
        }
      }
    }

    if (this.a) {
      console.log(explainStyle(
        `Calling Object/Function is ${JSON.stringify(this.a)}`));
    }

    if (this.error) {
      throw this.error;
    }
  }
}

const _formatMsg = function (msg) {
  const _msg = {};
  if (msg) {
    if (msg instanceof Error) {
      _msg.error = msg;
    }
    if (isString(msg.message)) {
      _msg.message = msg.message;
      _msg.explain = msg.explain;
      _msg.a = msg.a;
    } else if (isString(msg)) {
      _msg.message = msg;
    }
  }

  const now = moment();
  let diff = now - lastTime;
  if (!diff) {
    diff = 0;
  }
  lastTime = now;
  _msg.when = now.format('YYYY/MM/DD HH:mm:ss.SSS') +
    chalk.white('+' + diff + 'ms');

  return _msg;
};

export const info = function (msg) {
  return new Explanation(_formatMsg(msg));
};

export const warn = function (msg) {
  return new Explanation(_formatMsg(msg), {
    messageStyle: chalk.yellow.underline.inverse,
    leadingString: 'Warning: ',
    log: 'warn',
  });
};

export const error = function (msg) {
  const _msg = _formatMsg(msg);
  const error = msg instanceof Error ? msg : new Error(_msg.message);
  return new Explanation(_msg, {
    messageStyle: chalk.red.underline.inverse,
    leadingString: 'Error: ',
    log: 'error',
    error,
  });
};

Object.assign(Explanation, {
  info, warn, error,
});
