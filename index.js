const Express = require("express");
const app = new Express();

const http = require("http").Server(app);
const io = require("socket.io")(http);

const { Pool } = require("pg");
let config;
try {
    config = require("./config.json");
}
catch(e) {
    console.log(`config.json file does not exist. ${e}`);
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || config.connectionString
});

app.set("port", (process.env.PORT || 8080));
app.use(Express.static(`${__dirname}/public`));

pool.on("error", err => {
    console.error("Unexpected error on idle client", err);
    process.exit(-1);
});

app.get("/messages", (req, res) => {
    const query = {
        // SELECT NOW() - INTERVAL 1 DAY; would return messages from last 24 hour
        // This query returns all messages from current date
        text: "SELECT * FROM chatschema.messages WHERE timestamp::DATE = NOW()::DATE",
        rowMode: "array"
    };

    pool.query(query, (err, result) => {
        if (err) {
            res.end();
            throw err;
        }
        else {
            res.send(result.rows);
        }
    });
});

io.on("connection", socket => {
    const onlineUsers = io.engine.clientsCount;
    console.log(`There are currently ${onlineUsers} ${(onlineUsers == 1) ? "user" : "users"} online.`);

    socket.on("disconnect", () => {
        console.log(`There are currently ${onlineUsers} ${(onlineUsers == 1) ? "user" : "users"} online.`);
    });

    socket.on("chat message", (msg, sender) => {
        if (!sender) {
            sender = "Anonymous";
        }

        const msgQuery = {
            text: "INSERT INTO chatschema.messages VALUES (DEFAULT, DEFAULT, $1::varchar(24), $2::text)",
            values: [sender, msg]
        };

        pool.query(msgQuery, err => {
            if (err) {
                throw err;
            }
            else {
                const now = new Date(Date.now());
                console.log(`[${now.toISOString()}] ${sender} said: ${msg}`);
                io.emit("chat message", now, sender, msg);
            }
        });
    });
});

http.listen(app.get("port"), () => {
    console.log(`Node app is running on port ${app.get("port")}...`);
});