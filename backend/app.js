const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const http = require("http").createServer(app);

// app.use(cors)
const io = require("socket.io")(http ,{
   cors:{
      origin: '*'
   }
});

app.get("/", (req,res)=>{
   res.send("hello World")
});


let userList = new Map();

io.on("connection", (socket)=>{
   let userName = socket.handshake.query.userName;
   addUser(userName, socket.id);

   socket.broadcast.emit('user-list', [...userList.keys()]);
   socket.emit('user-list', [...userList.keys()])

   socket.on('message', (msg)=>{
      socket.broadcast.emit('message-broadcast', {message: msg, userName: userName})
   });

   socket.on('disconnect', (reason)=>{
      removeUser(userName, socket.id);
   })
})

function addUser(userName, id){
   if(!userList.has(userName)){
      userList.set(userName, new Set(id));
   }
   else {
      userList.get(userName).add(id);
   }
}

function removeUser(userName, id){
   if (userList.has(userName)){
      let userIds = userList.get(userName);
      if(userIds === 0){
         userList.delete(userName);
      }
   }
}
const port = process.env.PORT || 3000;
http.listen(port, ()=>{
   console.log(`server initiated: ${port}`)
})

// io.on('connection', (socket)=>{
//    socket.on('join', (data)=>{
//       socket.join(data.room);
//       socket.broadcast.to(data.room).emit('user joined')
//    });

//    socket.on('message', (data)=>{
//       io.in(data.room).emit('message', {user: data.user, message: data.message})
//    });
// });