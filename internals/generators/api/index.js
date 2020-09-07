/* eslint strict: ["off"] */

'use strict';

const apiExit = require('../utils/apiExit');

module.exports = {
  description: 'Create a api',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'What should it be called?',
      default: 'user',
      validate: (value) => {
        if (/.+/.test(value)) {
          return apiExit(value) ? 'Api already exists' : true;
        }
        return 'This field is required';
      },
    },
    {
      type: 'confirm',
      name: 'wantController',
      default: true,
      message: 'Do you want a controller ?',
    },
    {
      type: 'confirm',
      name: 'wantRoute',
      default: true,
      message: 'Do you want a route ?',
    },
    {
      type: 'confirm',
      name: 'wantModel',
      default: true,
      message: 'Do you want a model ?',
    },
    {
      type: 'confirm',
      name: 'wantValidate',
      default: true,
      message: 'Do you want a validation ?',
    },
  ],
  actions: (data) => {
    const actions = [];

    if (data.wantController) {
      actions.push({
        type: 'add',
        path: '../../server/api/{{name}}/{{name}}.controller.js',
        templateFile: './api/controller.js.hbs',
        abortOnFail: true,
      });
    }

    if (data.wantRoute) {
      actions.push({
        type: 'add',
        path: '../../server/api/{{name}}/{{name}}.route.js',
        templateFile: './api/route.js.hbs',
        abortOnFail: true,
      });
    }

    if (data.wantModel) {
      actions.push({
        type: 'add',
        path: '../../server/api/{{name}}/{{name}}.model.js',
        templateFile: './api/model.js.hbs',
        abortOnFail: true,
      });
    }

    if (data.wantValidate) {
      actions.push({
        type: 'add',
        path: '../../server/api/{{name}}/{{name}}.validation.js',
        templateFile: './api/validation.js.hbs',
        abortOnFail: true,
      });
    }

    actions.push({
      type: 'modify',
      path: '../../index.route.js',
      pattern: /(const .*Routes = require.*;\n)+/g,
      templateFile: './api/changeRoute/require.hbs',
    });

    actions.push({
      type: 'modify',
      path: '../../index.route.js',
      pattern: /(router.*Routes.*;\n)+/g,
      templateFile: './api/changeRoute/routerUse.hbs',
    });

    return actions;
  },
};
