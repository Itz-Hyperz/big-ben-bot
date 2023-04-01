// Basic Imports
const config = require("../config.json");
const express = require("express");
const app = express();
const chalk = require('chalk');

// Backend Initialization
const backend = require('./backend.js');
backend.init(app);

// Routing
app.get('', async function(req, res) {
    backend.resetAppLocals(app);
    res.render('index.ejs');
});

// MAKE SURE THIS IS LAST FOR 404 PAGE REDIRECT
app.get('*', function(req, res){
    res.render('404.ejs');
});

// Server Initialization
app.listen(config.port)
console.log(chalk.yellow('Big Benjamin Web Application Started on Port ' + config.port));
