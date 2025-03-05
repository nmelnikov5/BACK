const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8081 });

const clients = new Set();
const messages = []; 

wss.on("connection", (ws) => {
    clients.add(ws);
    console.log("Новый клиент подключился");

    // Отправляем историю сообщений новому клиенту
    messages.forEach(msg => ws.send(msg));

    ws.on("message", (message) => {
        console.log("Получено сообщение:", message.toString());
        
        // Добавляем сообщение в историю
        messages.push(message.toString());

        // Отправляем сообщение всем клиентам
        clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message.toString());
            }
        });
    });

    ws.on("close", () => {
        clients.delete(ws);
        console.log("Клиент отключился");
    });
});

console.log("WebSocket сервер запущен на порту 8081");
