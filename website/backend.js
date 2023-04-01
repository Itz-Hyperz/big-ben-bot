const config = require("../config.json");
const multer = require('multer');
const bodyParser = require('body-parser');
const session  = require('express-session');
const express = require("express");

let storedAppVariable;

async function init(app) {
    if (Number(process.version.slice(1).split(".")[0] < 16)) throw new Error(`Node.js v16 or higher is required, Discord.JS relies on this version, please update @ https://nodejs.org`);
    var multerStorage = multer.memoryStorage();
    app.use(multer({ storage: multerStorage }).any());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(express.json());
    app.use(session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false,
        cookie: {maxAge: 31556952000},
    }));
    app.set('views', './website/src/views');
    app.set('view engine', 'ejs');
    app.use(express.static('website/public'));
    app.use(express.static('website/src/static'));
    app.use('/assets', express.static('website/public/assets'));
    app.use('/static', express.static('website/src/static/assets'));
    await resetAppLocals(app);
};

async function resetAppLocals(app) {
    app.locals = {
        config: config,
        packagejson: require('../package.json')
    };
    storedAppVariable = app;
};

module.exports = {
    init: init,
    resetAppLocals: resetAppLocals
};
