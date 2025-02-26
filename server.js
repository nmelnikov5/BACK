// server.js - Сервер для отображения каталога
const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 8080;

// Middleware для обработки JSON
app.use(express.json());

// Раздача статических файлов (index.html, styles.css и другие ресурсы)
app.use(express.static(path.join(__dirname, "public")));

// Эндпоинт для получения списка товаров
app.get("/api/products", (req, res) => {
    fs.readFile("products.json", "utf8", (err, data) => {
        if (err) {
            res.status(500).json({ message: "Ошибка сервера" });
        } else {
            res.json(JSON.parse(data));
        }
    });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
