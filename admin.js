const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;

app.use(express.json());

const filePath = path.join(__dirname, "products.json");

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "admin.html"));
});


app.get("/api/products", (req, res) => {
    const filePath = path.join(__dirname, "products.json");
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error("Ошибка чтения файла:", err);
            return res.status(500).json({ message: "Ошибка сервера" });
        }
        res.json(JSON.parse(data));
    });
});


app.post("/api/products", (req, res) => {
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error("Ошибка чтения файла:", err);
            return res.status(500).json({ message: "Ошибка сервера" });
        }
        const products = JSON.parse(data);
        const newProduct = req.body;
        newProduct.id = products.length ? products[products.length - 1].id + 1 : 1;
        products.push(newProduct);
        fs.writeFile(filePath, JSON.stringify(products, null, 2), (err) => {
            if (err) {
                console.error("Ошибка записи файла:", err);
                return res.status(500).json({ message: "Ошибка сервера" });
            }
            res.status(201).json(newProduct);
        });
    });
});


app.put("/api/products/:id", (req, res) => {
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error("Ошибка чтения файла:", err);
            return res.status(500).json({ message: "Ошибка сервера" });
        }
        let products = JSON.parse(data);
        const productIndex = products.findIndex(p => p.id == req.params.id);
        if (productIndex === -1) {
            return res.status(404).json({ message: "Товар не найден" });
        }
        products[productIndex] = { ...products[productIndex], ...req.body };
        fs.writeFile(filePath, JSON.stringify(products, null, 2), (err) => {
            if (err) {
                console.error("Ошибка записи файла:", err);
                return res.status(500).json({ message: "Ошибка сервера" });
            }
            res.json(products[productIndex]);
        });
    });
});

app.delete("/api/products/:id", (req, res) => {
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error("Ошибка чтения файла:", err);
            return res.status(500).json({ message: "Ошибка сервера" });
        }
        let products = JSON.parse(data);
        const filteredProducts = products.filter(p => p.id != req.params.id);
        if (products.length === filteredProducts.length) {
            return res.status(404).json({ message: "Товар не найден" });
        }
        fs.writeFile(filePath, JSON.stringify(filteredProducts, null, 2), (err) => {
            if (err) {
                console.error("Ошибка записи файла:", err);
                return res.status(500).json({ message: "Ошибка сервера" });
            }
            res.json({ message: "Товар удалён" });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Админ-сервер запущен на http://localhost:${PORT}`);
});
