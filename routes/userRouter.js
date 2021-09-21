"use strict";
var express = require('express');
var createError = require('http-errors')
const UserClass = require('../model/user');
const config = require('../config');

//Configuration limit is set to 3, can be changed at config.js
const msgLimit = parseInt(config.configLimit);

// Dummy Array used to temporarily Store the Data
// Array of UserClass Objects
let userArr = [];


var router = express.Router();
router.route('/')
/*
GET function
Used to retrieve messages of a particular user
Name cannot be empty or null
Send a 404 error if User is not found
return a json file consisting of the username and its messages

//SAMPLE
http://localhost:3000/user?name=Shivam

*/
.get((req,res,next)=>
{
    //uses query parameters
   var userName = req.query.name;
   //trim all white spaces
   userName = userName.trim();

   if(userName == "" || userName == null)
   {
       next(createError(404, ("Name Cannot be NULL")));
       return;
   }
   for(var i=0;i<userArr.length;i++)
   {
       var item = userArr[i];
       if(item.name == userName)
       {
           res.statusCode = 200;
           res.setHeader('Content-Type','application/json');
           res.json({
               "User" : item.name,  //refer user.js in model
               "Messages" : item.arr  //item.arr is a list of messages defined inside a class, diff from userArr
           });
           return;
       }
            
   }
   next(createError(404, ("User Not Found")));
})
/*
POST function
Used to add a message for a particular user
ONLY 1 MESSAGE AT A TIME
If user is not present, A new user is created and added to the list
Send a 404 error if Name or message is empty or null
If a user has more messages than configLimit, then the first message in the list is deleted
return a json file consisting of the username and its messages

//SAMPLE
{
    "name":"Shivam",
    "message":"This is my 1st message"
}

*/
.post((req, res, next) => {
    //uses body paramters
	var userName = req.body.name;
    var msg = req.body.message;
    //trim all white spaces
    userName = userName.trim();
    if(userName == "" || userName == null)
    {
        next(createError(404, ("Name Cannot be NULL")));
        return;
    }
    if(msg == "" || msg == null)
    {
        next(createError(404, ("Message Cannot be NULL")));
        return;
    }
    var userArrLen = userArr.length;
    res.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    for(var i=0;i<userArrLen;i++)
    {
        var item = userArr[i];
        if(item.name == userName)
        {
            if(item.arrLen >= 3)
                item.removeMessage();   //refer user.js in model
            item.addMessage(msg);     //refer user.js in model
            res.json({
                "User" : item.name,  
                "Messages" : item.arr //item.arr is a list of messages defined inside a class, diff from userArr
            });
            return;
        }       
    }
    var obj = new UserClass(userName,msg);
    userArr.push(obj);  //userArrLen is not yet updated
    res.json({
        "User" : userArr[userArrLen].name,  //we effectivley need userArr.length-1 to access last message
        "Messages" : userArr[userArrLen].arr 
    });
    return;
    
})
.put((req,res,next)=>{
	res.statusCode = 403
	res.end("PUT not supported");
})
.delete((req,res,next)=>{
	res.statusCode = 403
	res.end("DEL not supported");
});

router.route('/getAllUsers')
.get((req,res,next)=>
{
    res.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    res.json(userArr);
});

module.exports = router;