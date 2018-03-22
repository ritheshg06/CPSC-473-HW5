var http = require("http");
var fs = require("fs");
var extract = require("./extract");
var mime = require("mime");
var wss = require("./websockets-server");
console.log(wss);

var handleError = function(err, res) {
  res.writeHead(404);
  res.end();
};

var server = http.createServer(function(req, res) {
  console.log("Responding to a request.");
  var filePath = extract(req.url);
  fs.readFile(filePath, function(err, data) {
    if (err) {
      // handleError(err, res);
      filePath = "app/error.html";
      fs.readFile(filePath, function(err, data) {
        if (err) {
          handleError(err, res);
          return;
        } else {
          res.setHeader("Content-Type", mime.getType(filePath));
          res.end(data);
        }
      });
      return;
    } else {
      res.setHeader("Content-Type", mime.getType(filePath));
      res.write(data);
      var s = "";

      fs.readdir("app/", function(err, files) {

        if (err) {
          console.log("Had trouble reading the directory");
          return;
        } else {
          // console.log(files);
          files.forEach(function(file) {
            var re = /^[^.]+$|.+\.(?=(html)$)([^.]+$)/;
            var found = file.match(re);
            if (!found) {
              console.log(file);
              s += "<li><a href=\"" + file + "\">" + file + " - " + mime.getType(file) + "</a></li>";
            }
          });
        }
        res.end("<ul>" + s + "</ul>");
      });


    }
  });
});
server.listen(3000);
