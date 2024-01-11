'use strict';
var  createServer = require ('node:http')
var  json= require('node:stream/consumers')
var  listTask = require( './Functions/tasks_data.js')

var path = require('path');
var express = require('express');

var app = express();

var staticPath = path.join(__dirname, '/');
app.use(express.static(staticPath));

// Allows you to set port in the project properties.
app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function () {
    console.log('listening');
});

app.get("/liste_des_taches", function (req, res) {

    const tasks = listTask()
    res.write(JSON.stringify(tasks))

});