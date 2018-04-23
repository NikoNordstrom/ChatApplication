const socket = io({
    transports: ["websocket"]
});

socket.on("reconnect_attempt", () => {
    socket.io.opts.transports = ["polling", "websocket"];
});

if (!localStorage.username) {
    document.querySelector(".popup").style.display = "block";
}
else {
    document.querySelector("nav ul").style.display = "block";
    document.querySelector("#username").innerText = localStorage.username;
}

function getTimestamp(time) {
    time = new Date(time);
    const hours = time.getHours();
    let minutes = time.getMinutes();

    if (minutes < 10) {
        minutes = `0${minutes}`;
    }
    return `${hours}:${minutes}`;
}

function appendMessageItem(time, sender, msg) {
    const msgList = document.querySelector("#message-list");
    const msgInfo = document.createElement("span");
    msgInfo.innerText = `${getTimestamp(time)} ${sender}`;

    const msgItem = document.createElement("li");
    const msgText = document.createElement("p");
    msgText.innerText = msg;

    msgItem.appendChild(msgInfo);
    msgItem.appendChild(msgText);
    msgList.appendChild(msgItem);
    msgList.scrollTop = msgList.scrollHeight;
}

document.querySelector("#username-form").addEventListener("submit", (event) => {
    document.querySelector(".popup").style.display = "none";
    localStorage.username = document.querySelector("#username-txt").value;
    document.querySelector("nav ul").style.display = "block";
    document.querySelector("#username").innerText = localStorage.username;
    event.preventDefault();
});

document.querySelector("#message-form").addEventListener("submit", (event) => {
    const message = document.querySelector("#message-txt");
    if (localStorage.username) {
        socket.emit("chat message", message.value, localStorage.username);
    }
    else {
        document.querySelector(".popup").style.display = "block";
    }
    document.querySelector("#message-txt").value = "";
    event.preventDefault();
});

document.querySelector("#username").addEventListener("click", () => {
    document.querySelector(".popup").style.display = "block";
});

socket.on("chat message", (time, sender, msg) => {
    appendMessageItem(time, sender, msg);
});