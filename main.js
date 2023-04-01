require('./src/Client.js').init();
setTimeout(function() {
    require('./website/index.js');
}, 4000);