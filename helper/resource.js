const express = require('express');
const router = express.Router();

module.exports = (controller) => {
    const orderedActions = {
        index: 'get',
        create: 'get',
        store: 'post',
        show: 'get',
        edit: 'get',
        update: 'put',
        destroy: 'delete'
    };

    let controllerActions = Object.keys(controller);

    Object.keys(orderedActions).forEach(action => {
        let method;

        if (!~controllerActions.indexOf(action)) {
            return;
        }

        method = orderedActions[action];

        let {
            url,
            before = [],
            handler
        } = controller[action];

        router[method](url, ...[...before, handler]);
    });

    return router;
}
