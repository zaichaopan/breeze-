# Todo

```js
const threadsController = require('controllers/threads');
const resource from 'helpers/resource'

module.exports = (parent) {
    app.use(resource(threadsController));
    app.use(resource(repliesController))'
    parent.use(app);
}

```
