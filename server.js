const express = require("express");
const fs = require("fs");
const path = require("path");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Схема GraphQL
const schema = buildSchema(`
    type Product {
        id: ID!
        name: String
        price: Int
        description: String
        categories: [String]
    }

    type Query {
        products(fields: [String]!): [Product]
    }
`);

// Чтение данных из JSON с обработкой ошибок
const getProducts = () => {
    try {
        const data = fs.readFileSync("products.json", "utf8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Ошибка чтения products.json:", error);
        return [];
    }
};

// Резолверы
const root = {
    products: ({ fields }) => {
        const products = getProducts();
        
        if (!fields || fields.length === 0) {
            return products; // Если fields пустой, вернуть все товары
        }

        return products.map(product => {
            let filteredProduct = { id: product.id }; // Всегда добавляем ID
            fields.forEach(field => {
                if (product[field] !== undefined) {
                    filteredProduct[field] = product[field];
                }
            });
            return filteredProduct;
        });
    }
};

// GraphQL эндпоинт
app.use(
    "/graphql",
    graphqlHTTP({
        schema: schema,
        rootValue: root,
        graphiql: true
    })
);

app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${PORT}/graphql`);
});
