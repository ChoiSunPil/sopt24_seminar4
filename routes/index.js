var express = require('express');
var router = express.Router();
const  homework = require('./homework/index.js') 
router.use('/homework',homework)
module.exports = router;
