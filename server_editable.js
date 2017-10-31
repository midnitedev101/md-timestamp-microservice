/******************************************************
 * CAN EDIT THIS FILE
 * the verification process may break but revert back to server.js if it does
 * ***************************************************/

'use strict';

var fs = require('fs');
var express = require('express');
var app = express();


if (!process.env.DISABLE_XORIGIN) {
  app.use(function(req, res, next) {
    var allowedOrigins = ['https://narrow-plane.gomix.me', 'https://www.freecodecamp.com'];
    var origin = req.headers.origin || '*';
    if(!process.env.XORIG_RESTRICT || allowedOrigins.indexOf(origin) > -1){
         console.log(origin);
         res.setHeader('Access-Control-Allow-Origin', origin);
         res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    }
    next();
  });
}

app.get('/:datetime', function(req, res) {
  //console.log(req.params.datetime);
  var monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  if (isNaN(req.params.datetime)) {
      var dateParamArr = (req.params.datetime).split(" ");
      //console.log(dateParamArr[0]);
      //console.log(monthName.indexOf(dateParamArr[0]));
      //var verMonth = dateParamArr[0] + 1;
      //console.log(verMonth);
      if(monthName.indexOf(dateParamArr[0]) !== -1) {
        //var monthNum = monthName.indexOf(dateParamArr[0]).toString();
        var monthNum = monthName.indexOf(dateParamArr[0]);
        monthNum += 1;
        monthNum = monthNum.toString();
        console.log(monthNum);
        
        if(monthNum.length < 2) {
          monthNum = "0" + monthNum;
          //console.log(monthNum);
        }
        //console.log('' + (monthName.indexOf(dateParamArr[0])) + ' ' + dateParamArr[1] + ' ' + dateParamArr[2]);
        //var unixTime = new Date('' + monthName.indexOf(dateParamArr[0] + 1) + ' ' + dateParamArr[1] + ' ' + dateParamArr[2]);
        var unixTime = new Date(monthNum + ' ' + dateParamArr[1] + ' ' + dateParamArr[2]);
        console.log(unixTime);
        //res.send(Date.parse(unixTime));
        var unixTimeObj = {unix: Date.parse(unixTime), natural: req.params.datetime};
        res.send(unixTimeObj)
      }
      //var unixTime = url.substring( url.indexOf('?') + 1 );
      //console.log(unixTime);
      //var unixTimeObj = {unix: unixtime, natural: req.params.datetime};
      //res.send(unixTimeObj);
  }
  else {
    console.log('no');
    var dateTime = new Date(req.params.datetime*1000);
    var year = dateTime.getFullYear();
    var month = dateTime.getMonth();
    var date = dateTime.getDate();
    //var hour = dateTime.getHours();
    //var min = dateTime.getMinutes();
    //var sec = dateTime.getSeconds();
    //var dateAndTime = month + ' ' + date + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    var fullDate = monthName[month] + ' ' + date + ', ' + year;
    //dateTimeObj = {unix: req.params.datetime, natural: dateAndTime};
    dateTimeObj = {unix: req.params.datetime, natural: fullDate};
    res.send(dateTimeObj);
  }
  //res.send('hey');
});

app.use('/public', express.static(process.cwd() + '/public'));

app.route('/_api/package.json')
  .get(function(req, res, next) {
    console.log('requested');
    fs.readFile(__dirname + '/package.json', function(err, data) {
      if(err) return next(err);
      res.type('txt').send(data.toString());
    });
  });
  
app.route('/')
    .get(function(req, res) {
		  res.sendFile(process.cwd() + '/views/index.html');
    })

// Respond not found to all the wrong routes
app.use(function(req, res, next){
  res.status(404);
  res.type('txt').send('Not found');
});

// Error Middleware
app.use(function(err, req, res, next) {
  if(err) {
    res.status(err.status || 500)
      .type('txt')
      .send(err.message || 'SERVER ERROR');
  }  
})

app.listen(process.env.PORT, function () {
  console.log('Node.js listening ...');
});
