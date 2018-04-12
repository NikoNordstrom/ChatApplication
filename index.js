const Express = require("express");
const app = new Express();

const http = require("http").Server(app);
const io = require("socket.io")(http);

app.set("port", (process.env.PORT || 8080));
app.use(Express.static(`${__dirname}/public`));

let onlineUsers = 0;

io.on("connection", socket => {
    onlineUsers++;
    console.log(`There are currently ${onlineUsers} ${(onlineUsers == 1) ? "user" : "users"} online.`);

    socket.on("disconnect", () => {
        onlineUsers--;
        console.log(`There are currently ${onlineUsers} ${(onlineUsers == 1) ? "user" : "users"} online.`);
    });

    socket.on("chat message", (msg, sender) => {
        const now = new Date(Date.now());
        console.log(`[${now.toISOString()}] ${sender} said: ${msg}`);
        io.emit("chat message", now, sender, msg);
    });
});

http.listen(app.get("port"), () => {
    console.log(`Node app is running on port ${app.get("port")}...`);
});