var express = require('express');
var router = express.Router();
const path = require('path')
const modulePath  = path.join(__dirname,'../../../module')
const connection = require(path.join(__dirname,'../../../config/dbConfig.js'))
const encryption = require(path.join(modulePath,'./encryption.js'))
const responseMessage = require(path.join(modulePath,'./responseMessage.js'))
const utils = require(path.join(modulePath,'./utils.js'))
const statusCode = require(path.join(modulePath,'./statusCode.js'))
const selectAllBoardQuery = 'SELECT  boardIdx  , id AS writer ,title,content , writetime FROM board INNER JOIN user ON board.writer = user.userIdx '
const selectUserBoardQuery = 'SELECT  boardIdx  , id AS writer ,title,content , writetime FROM board INNER JOIN user ON board.writer = user.userIdx WHERE id = ?'
const insertBoardQuery = "INSERT INTO board (writer,title,content,boardPw,salt) VALUES (?,?,?,?,?)"
router.get('/',(req,res)=>{
connection.query(selectAllBoardQuery,(err,result)=>{
if(err)
{
    res.send(utils.successFalse(statusCode.DB_ERROR,responseMessage.DB_ERR))
}
else if(result.length <1)
{
    res.send(utils.successFalse(statusCode.NO_CONTENT, responseMessage.SEARCH_TABLE_FAIL))
}
else{
    res.send(utils.successTrue(statusCode.OK,responseMessage.SEARCH_TABLE_SUCCESS,result))
}
})
})
router.get('/:id',(req,res)=>{
if(!req.params.id)
{
    res.send(utils.successFalse(statusCode.BAD_REQUEST,responseMessage.NULL_VALUE))
    return
}
    connection.query(selectUserBoardQuery,req.params.id,(err,result)=>{
        if(err)
        {
            res.send(utils.successFalse(statusCode.DB_ERROR,responseMessage.DB_ERR))
        }
        else if(result.length <1)
        {
            res.send(utils.successFalse(statusCode.NO_CONTENT, responseMessage.SEARCH_TABLE_FAIL))
        }
        else{
            res.send(utils.successTrue(statusCode.OK,responseMessage.SEARCH_TABLE_SUCCESS,result))
        }
        })
})
router.post('/',async(req,res)=>{
    if(!req.body.title || !req.body.content || !req.body.boardPw|| !req.body.writer)
    {
    //요청 바디값 오류
    res.send(utils.successFalse(statusCode.BAD_REQUEST,responseMessage.NULL_VALUE))
    return
    }

    let hashJson = await encryption.asyncCipher(req.body.password)
    connection.query(insertBoardQuery,[req.body.writer,req.body.title,hashJson.cryptoPw,hashJson.salt],(err,result)=>{

        if(err)
        {
            res.send(utils.successFalse(statusCode.DB_ERROR,responseMessage.DB_ERR))
        }
        else
        {
            res.send(utils.successTrue(statusCode.OK,responseMessage.CREATED_TABLE_SUCCESS))
        }
    })
})
router.put('/',(req,res)=>{


    

})
router.delete('/',(req,res)=>{




})

module.exports = router;