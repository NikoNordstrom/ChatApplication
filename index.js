const Express = require("express");
const app = new Express();

const http = require("http").Server(app);
const io = require("socket.io")(http);

const { Pool } = require("pg");
const config = require("./config.json");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || config.connectionString
});

app.set("port", (process.env.PORT || 8080));
app.use(Express.static(`${__dirname}/public`));

io.on("connection", socket => {
    const onlineUsers = io.engine.clientsCount;
    console.log(`There are currently ${onlineUsers} ${(onlineUsers == 1) ? "user" : "users"} online.`);

    pool.query("SELECT * FROM chatschema.messages WHERE timestamp::DATE = NOW()::DATE", (err, res) => {
        if (err) {
            throw err;
        }
        else {
            console.log(res);
        }
    });

    socket.on("disconnect", () => {
        console.log(`There are currently ${onlineUsers} ${(onlineUsers == 1) ? "user" : "users"} online.`);
    });

    pool.on("error", err => {
        console.error("Unexpected error on idle client", err);
        process.exit(-1);
    });

    socket.on("chat message", (msg, sender) => {
        if (!sender) {
            sender = "Anonymous";
        }
        const now = new Date(Date.now());

        const msgQuery = {
            text: "INSERT INTO chatschema.messages VALUES (DEFAULT, DEFAULT, $1::varchar(24), $2::text)",
            values: [sender, msg]
        };

        pool.query(msgQuery, err => {
            if (err) {
                throw err;
            }
            else {
                console.log(`[${now.toISOString()}] ${sender} said: ${msg}`);
                io.emit("chat message", now, sender, msg);
            }
        });
    });
});

http.listen(app.get("port"), () => {
    console.log(`Node app is running on port ${app.get("port")}...`);
});