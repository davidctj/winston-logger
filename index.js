const express = require('express')
const app = express()
const port = 3000

const logger = require('./logger');

app.get('/', (req, res) => {
    logger.debug('This is debug', {"app": "example-app"});
    logger.info('This is info');
    logger.warn('This is warn');
    logger.error('This is error');
    res.send('Hello World!')
})

app.listen(port, () => logger.info(`Example app listening at http://localhost:${port}`))