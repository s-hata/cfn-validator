'use strict';

import path from 'path';
import chalk from 'chalk';
import AWS from 'aws-sdk';


const NAME = 'CFn Validator';
const API_VERSION = '2010-05-15';
const CUR_PATH = path.basename(process.cwd());

export default class CfnValidator {

  constructor(options) {
    this._options = Object.assign(
      {},
      { apiVersion: API_VERSION },
      options);
    this._client = new AWS.CloudFormation(this._options);
  }

  validation(file, contents, charset) {
    const params = {
      TemplateBody: contents.toString(charset)
    };
    return this._client.validateTemplate(params).promise()
      .then(result => {
        console.log('\n  %s %s', chalk.green('✓'), chalk.underline(path.relative(CUR_PATH, file)));
      })
      .catch(error => {
        console.error('\n  %s %s', chalk.red('×'), chalk.underline(path.relative(CUR_PATH, file)));
        console.error('    time    :', error.time);
        console.error('    code    :', error.code);
        console.error('    message :', error.message);
      });
  };
}
