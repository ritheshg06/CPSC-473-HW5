var WebSocket = require("ws");
var WebSocketServer = WebSocket.Server;
var port = 3001;
var ws = new WebSocketServer({
  port: port
});
var messages = [];
var topic = "";

function isNewTopic(str) {
  if (!str) {
    return;
  }
  var re = /^\/topic (.+)$/;
  console.log(str.match(re));
  var found = str.match(re);

  return found ? found[1] : null;

}

console.log("websockets server started");

ws.on("connection", function(socket) {
  console.log("client connection established");

  if (topic) {
    socket.send("*** Topic is '" + topic + "'");
  }
  messages.forEach(function(msg) {
    socket.send(msg);
  });

  socket.on("message", function(data) {
    console.log("message received: " + data);
    var t = isNewTopic(data);
    if (t) {
      topic = t;
      data = "*** Topic has changed to '" + t + "'";
    } else {
      messages.push(data);
    }

    ws.clients.forEach(function(clientSocket) {
      clientSocket.send(data);
    });
  });
});
