var http = require('http'),
    parser = require('./params_parser.js'),
    render = require('./render_view.js'),
    fs = require('fs');

var p = parser.parse;
var r = render.render;

http.createServer(function(req,res){

    if(req.url.indexOf("favicon.ico") > 0){ return; }

    fs.readFile("./index.html",function(err,html){                
        var parametros = p(req);           
        res.writeHead(200,{"Content-Type":"text/html"});
        res.write(r(html,parametros));        
        res.end();
    });    
}).listen(8080);