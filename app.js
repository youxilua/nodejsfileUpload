
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
//  app.set('view engine', 'jade');
  app.use(express.favicon());
    app.set('view engine', 'ejs');
 //   app.set('view options', {layout: false});
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
 // app.use(express.bodyParser({uploadDir:'./uploads'}));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/upload.html', function(req,res){
    res.render('upload');
});
// 移动文件需要使用fs模块
var fs = require('fs');
app.post('/file-upload', function(req, res) {
    // 获得文件的临时路径
    var tmp_path = req.files.thumbnail.path;
    console.log("temp_path->"+tmp_path);
    // 指定文件上传后的目录 - 示例为"images"目录。
    var target_path = './public/images/' + req.files.thumbnail.name;
    // 移动文件
    fs.rename(tmp_path, target_path, function(err) {
        if (err) throw err;
        // 删除临时文件夹文件,
        fs.unlink(tmp_path, function() {
            if (err) throw err;
            res.send('File uploaded to: ' + target_path + ' - ' + req.files.thumbnail.size + ' bytes' + "target_path" + target_path);
        });
    });
});


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
