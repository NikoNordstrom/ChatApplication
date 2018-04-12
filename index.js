const Express = require("express");
const app = new Express();

const http = require("http").Server(app);
const io = require("socket.io")(http);

app.set("port", (process.env.PORT || 8080));
app.use(Express.static(`${__dirname}/public`));

io.on("connection", socket => {
    console.log("User has connected!");

    socket.on("disconnect", () => {
        console.log("User has disconnected!");
    });

    socket.on("chat message", (msg, sender) => {
        const now = new Date(Date.now());
        console.log(`[${now}] ${sender} said: ${msg}`);
        io.emit("chat message", now, sender, msg);
    });
});

http.listen(app.get("port"), () => {
    console.log(`Node app is running on port ${app.get("port")}...`);
});