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
const selectUserBoardQuery = 'SELECT  boardIdx , id AS writer ,title,content , writetime FROM board INNER JOIN user ON board.writer = user.userIdx WHERE id = ?'
const insertBoardQuery = "INSERT INTO board (writer,title,content,boardPw,salt) VALUES (?,?,?,?,?)"
const selectBoardByIdxQuery  = 'SELECT * FROM board WHERE boardIdx = ?'
const deleteBoardQuery = 'DELETE from board where boardIdx = ?'
const updateBoardQuery = "UPDATE board SET title = ?,content = ?, writetime = now() WHERE boardIdx = ?"
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
console.log(req.params.id)
    connection.query(selectBoardByIdxQuery,[req.params.id],(err,result)=>{
        console.log(result)
        if(err)
        {
            res.send(utils.successFalse(statusCode.DB_ERROR,responseMessage.DB_ERR))
        }
        else if(result.length <1)
        {
            res.send(utils.successFalse(statusCode.NO_CONTENT, responseMessage.SEARCH_TABLE_FAIL))
        }
        else{
            for(let  i = 0 ; i < result.length ;i++)
            {
            delete result[i]['boardPw']
            delete result[i]['salt']
            }

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

    let hashJson = await encryption.asyncCipher(req.body.boardPw)
    connection.query(insertBoardQuery,[req.body.writer,req.body.title,req.body.content,hashJson.cryptoPw,hashJson.salt],(err,result)=>{

        if(err)
        {
            console.log(err)
            res.send(utils.successFalse(statusCode.DB_ERROR,responseMessage.DB_ERR))
        }
        else
        {
            res.send(utils.successTrue(statusCode.OK,responseMessage.CREATED_TABLE_SUCCESS))
        }
    })
})
router.put('/',(req,res)=>{
    if(!req.body.title || !req.body.content || !req.body.boardPw|| !req.body.boardIdx)
    {
    //요청 바디값 오류
    res.send(utils.successFalse(statusCode.BAD_REQUEST,responseMessage.NULL_VALUE))
    return
    }

    let boardIdx = req.body.boardIdx
    let boardPw = req.body.boardPw
    let boardContent = req.body.content
    let boardTitle = req.body.title
    connection.query(selectBoardByIdxQuery,[boardIdx],async(err,result)=>{
        if(err)
        {
            console.log(err)
            res.send(utils.successFalse(statusCode.DB_ERROR,responseMessage.DB_ERR))
        }
        else
        {
            
            if(result.length <1)
            {
                res.send(utils.successFalse(statusCode.NO_CONTENT,responseMessage.NO_TABLE))
            }
            else
            {
            console.log(result[0])    
            await encryption.asyncVerifyConsistency(boardPw,result[0].salt,result[0].boardPw).then(()=>{
            connection.query(updateBoardQuery,[boardTitle,boardContent,boardIdx],(err,result)=>{
               if(err)
               {
                console.log(err)
                res.send(utils.successFalse(statusCode.DB_ERROR,responseMessage.DB_ERR))
               }
               else
               {
                res.send(utils.successTrue(statusCode.OK,responseMessage.MODIFY_TABLE_SUCCESS))
               }
            })
        }).catch(()=>{
            res.send(utils.successFalse(statusCode.NO_CONTENT,responseMessage.WRONG_TABLE_PW))
        })
        }
        } 
        })
        })
router.delete('/',(req,res)=>{
let boardIdx = req.body.boardIdx.toString()
let boardPw = req.body.boardPw.toString()
console.log(req.body)
console.log(boardIdx+" "+boardPw)
if(boardIdx == undefined|| boardPw == undefined)
{
//요청 바디값 오류
res.send(utils.successFalse(statusCode.BAD_REQUEST,responseMessage.NULL_VALUE))
return
}
connection.query(selectBoardByIdxQuery,[boardIdx],async(err,result)=>{
if(err)
{
    console.log(err)
    res.send(utils.successFalse(statusCode.DB_ERROR,responseMessage.DB_ERR))
}
else
{
    
    if(result.length <1)
    {
        res.send(utils.successFalse(statusCode.NO_CONTENT,responseMessage.NO_TABLE))
    }
    else
    {
    console.log(result[0])    
     await encryption.asyncVerifyConsistency(boardPw,result[0].salt,result[0].boardPw).then(()=>{
    connection.query(deleteBoardQuery,[boardIdx],(err,result)=>{
       if(err)
       {
        console.log(err)
        res.send(utils.successFalse(statusCode.DB_ERROR,responseMessage.DB_ERR))
       }
       else
       {
        res.send(utils.successTrue(statusCode.OK,responseMessage.DELETE_TABLE_SUCCESS))
       }
    })
}).catch(()=>{
    res.send(utils.successFalse(statusCode.NO_CONTENT,responseMessage.WRONG_TABLE_PW))
})
}
} 
})
})

module.exports = router;