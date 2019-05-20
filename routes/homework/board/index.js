var express = require('express');
var router = express.Router();
const  board = require('./board.js') 
router.use('/',board)
module.exports = router;