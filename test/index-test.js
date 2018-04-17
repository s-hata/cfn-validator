import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { expect } from 'chai';
import sinon from 'sinon';
import CfnValidator from '../src';


const REGION = 'ap-northeast-1';

describe('CFn template validation', () => {

  it('should be OK when validate a valid template file', (done) => {
    const spy = sinon.spy(console, 'log');
    const validator = new CfnValidator({ region: REGION });
    const file = path.join(__dirname, 'valid-tmpl.yml');
    validator.validation(file, fs.readFileSync(file), 'utf-8')
    .then(() => {
      expect(spy.calledOnce).to.true;
      expect(spy.args[0][0]).to.equal('\n  %s %s');
      expect(spy.args[0][1]).to.equal('\u001b[32m✓\u001b[39m');
      expect(spy.args[0][2]).to.equal('\u001b[4m../test/valid-tmpl.yml\u001b[24m');
    }).then(done, done);
  });

  it('should be NG when validate a invalid template file', (done) => {
    const spy = sinon.stub(console, 'error');
    const validator = new CfnValidator({ region: REGION });
    const template = path.join(__dirname, 'invalid-tmpl.yml');
    validator.validation(template, fs.readFileSync(template))
    .then(() => {
      expect(spy.callCount).to.equal(4);
      expect(spy.args[0][0]).to.equal('\n  %s %s');
      expect(spy.args[0][1]).to.equal('\u001b[31m×\u001b[39m');
      expect(spy.args[0][2]).to.equal('\u001b[4m../test/invalid-tmpl.yml\u001b[24m');
      expect(spy.args[1][0]).to.equal('    time    :');
      expect(spy.args[2][0]).to.equal('    code    :');
      expect(spy.args[2][1]).to.equal('ValidationError');
      expect(spy.args[3][0]).to.equal('    message :');
      expect(spy.args[3][1]).to.equal('Template format error: YAML not well-formed. (line 7, column 3)');
    }).then(done, done);
  });
});
