const fs = require('fs');
const path = require('path');
const express = require('express');

module.exports = (parent, options) => {
    const dir = path.join(__dirname, '..', 'controllers');
    const {
        verbose
    } = options;

    fs.readdirSync(dir).forEach(name => {
        const file = path.join(dir, name);
        if (!fs.statSync(file).isDirectory()) return;
        verbose && console.log('\n %s:', name);
        const app = express();
        const obj = require(file);
        name = obj.name || name;
        let prefix = obj.prefix || '';
        let method;
        let url;

        for (let key in obj) {
            if (~['prefix', 'name'].indexOf(key)) continue;

            switch (key) {
                case 'index':
                    method = 'get';
                    url = `/${name}`;
                    break;
                case 'create':
                    method = 'get';
                    url = `/${name}/create`;
                    break;
                case 'store':
                    method = 'post';
                    url = `/${name}`;
                    break;
                case 'show':
                    method = 'get';
                    url = `/${name}/:_id`;
                    break;
                case 'edit':
                    method = 'get';
                    url = `/${name}/:_id/edit`;
                    break;
                case 'update':
                    method = 'put';
                    url = `/${name}/:_id`;
                    break;
                case 'destroy':
                    method = 'delete';
                    url = `/${name}/:_id`;
                    break;
                default:
                    throw new Error('unrecognized route: ' + name + '.' + key);
            }

            url = prefix + url;

            app[method](url, ...Array.isArray(obj[key]) ? obj[key] : [obj[key]]);
            verbose && console.log('\n %s %s -> before -> %s', method.toUpperCase(), url, key);
        }

        parent.use(app);
    });
};
