var express = require('express');
var router = express.Router();
const board = require('./board/index')
const sign = require('./sign/index')
router.use('/board',board)
router.use('/',sign)

module.exports = router;