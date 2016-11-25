import Muter, {captured} from 'muter';
import {expect} from 'chai';
import chalk from 'chalk';
import moment from 'moment';
import isString from 'is-string';
import escape from 'escape-string-regexp';
import {info, warn, error} from '../src/explanation';

describe('Testing Explanation', function() {

  const muter = Muter(console);

  const data = {id: 1, name: 'Ann O\'Nymous'};
  const data2 = {id: 2, name: 'Arn Strup'};

  [
    [info, {
      message: 'Doing this',
      explain: 'We want that'
    }],
    [warn, { // explain can be an arbitary array of messages
      message: 'Something has occurred',
      explain: [ 'You should have done this',
      'and you should have done this',
      'and this' ]
    }],
    [error, { // An instance explanation can be a 2-array
      message: 'An error has occurred',
      explain: [ 'You have called : ', data ] // Problem with this data
    }],
    [error, { // Explanations types can be mixed
      message: 'Another error has occurred',
      explain: [ ['You have called : ', data],
      'Dummy you!',
      ['And you have also called', data2],
      'That\'s even worse :(!' ]
    }],
    [error, new Error('Bad bad mistake')]
  ].forEach(args => {

    const [log, arg] = args;

    it(`Testing '${arg.message}' example`, captured(muter, function () {

      if (log !== error) {
        log(arg);
      } else {
        expect(() => log(arg)).to.throw();
      }

      const logs = muter.getLogs();
      expect(logs).to.match(new RegExp(arg.message));
      expect(logs).to.match(new RegExp('⌚: ' + moment()
        .format('YYYY/MM/DD')));

      const explain = arg.explain;
      if (explain) {
        if (isString(explain)) {
          expect(logs).to.match(new RegExp(explain));
        } else {
          if (Array.isArray(explain)) {
            explain.forEach(el => {
              if (isString(el)) {
                expect(logs).to.match(new RegExp(escape(el)));
              } else {
                if (Array.isArray(el)) {
                  el.forEach(e => {
                    if (isString(e)) {
                      expect(logs).to.match(new RegExp(escape(e)));
                    } else {
                      expect(logs).to.match(new RegExp(escape(
                        JSON.stringify(e))));
                    }
                  });
                } else {
                  expect(logs).to.match(new RegExp(escape(
                    JSON.stringify(el))));
                }
              }
            });
          }
        }
      }
    }));

  })

});
